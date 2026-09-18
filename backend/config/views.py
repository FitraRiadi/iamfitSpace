import time

from django.db import connection
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    """Public liveness probe (no auth). Tells Django-up vs DB-down apart."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        started = time.perf_counter()
        try:
            with connection.cursor() as cur:
                cur.execute('SELECT 1')
                cur.fetchone()
            db = {
                'status': 'up',
                'latency_ms': round((time.perf_counter() - started) * 1000),
            }
            code = 200
        except Exception as exc:  # never leak connection details
            db = {'status': 'down', 'error': type(exc).__name__}
            code = 503
        return Response({'ok': code == 200, 'db': db}, status=code)
