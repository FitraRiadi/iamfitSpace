"""
IamFit Space API — Django settings (env-based).

Local dev:  copy backend/.env.example to backend/.env (or export vars).
Vercel:     set the same vars in the project dashboard.
Database:   DATABASE_URL empty -> local SQLite.
            Supabase pooler, e.g.:
            postgresql://postgres:PASSWORD@aws-0-ap-xxx.pooler.supabase.com:6543/postgres
            (pooler port 6543 + CONN_MAX_AGE=0 are REQUIRED on serverless)
"""

import os
from datetime import timedelta
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent


def _load_dotenv():
    """Load backend/.env into os.environ (stdlib only, dev convenience).

    Real environment variables always win — file values never override them.
    """
    dotenv = BASE_DIR / '.env'
    if not dotenv.is_file():
        return
    for raw in dotenv.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, _, value = line.partition('=')
        key, value = key.strip(), value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


_load_dotenv()


def env(name, default=None):
    return os.environ.get(name, default)


def env_bool(name, default=False):
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in ('1', 'true', 'yes', 'on')


def env_list(name, default=''):
    raw = os.environ.get(name, default)
    return [x.strip() for x in str(raw).split(',') if x.strip()]


SECRET_KEY = env('SECRET_KEY', 'django-insecure-dev-only-change-me')
DEBUG = env_bool('DEBUG', True)
ALLOWED_HOSTS = env_list(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1' if DEBUG else '',
)


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    # local
    'accounts',
    'crm',
    'projects',
    'billing',
    'catalog',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database — SQLite when DATABASE_URL is empty, else Postgres (Supabase).

DATABASE_URL = (env('DATABASE_URL', '') or '').strip().strip('"').strip("'")

import sys

TESTING = 'test' in sys.argv

if TESTING or not DATABASE_URL:
    # Tests always run on throwaway SQLite (fast + never touches Supabase).
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3' if not TESTING else ':memory:',
        }
    }
elif DATABASE_URL:
    scheme = DATABASE_URL.split('://', 1)[0].lower()
    if scheme not in ('postgres', 'postgresql', 'pgsql', 'sqlite', 'spatialite'):
        from django.core.exceptions import ImproperlyConfigured

        raise ImproperlyConfigured(
            "DATABASE_URL must be a Postgres connection string "
            f"(postgresql://user:pass@host:6543/dbname), got scheme '{scheme}'. "
            'The Supabase API URL (https://...) will NOT work here.'
        )
    DATABASES = {
        'default': dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=0,  # required on serverless / pooler
            disable_server_side_cursors=True,  # required on PgBouncer
        )
    }
    # Fail fast instead of hanging: on Vercel a hanging connect gets the
    # whole function killed (-> opaque 500). With a timeout it becomes a
    # clean 503 from /api/health/ that names the problem. Postgres only.
    if DATABASES['default']['ENGINE'].endswith('postgresql'):
        DATABASES['default'].setdefault('OPTIONS', {})['connect_timeout'] = int(
            env('DB_CONNECT_TIMEOUT', '8')
        )
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# Internationalization

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Jakarta'
USE_I18N = True
USE_TZ = True


# Static files (WhiteNoise — works on Vercel serverless).
# NOTE: deliberately NOT the manifest storage. Vercel never runs
# collectstatic, so no manifest exists there — and {% static %} with a
# manifest storage raises ValueError (-> Django 500) on every
# browsable-API/admin page. CompressedStaticFilesStorage needs nothing.
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage'},
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Django REST framework

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'PAGE_SIZE_QUERY_PARAM': 'page_size',
    'MAX_PAGE_SIZE': 200,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}


# CORS (JWT goes in headers — no cookies needed)

CORS_ALLOWED_ORIGINS = env_list(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,http://127.0.0.1:5173' if DEBUG else '',
)
CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS', '')
