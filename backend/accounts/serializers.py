from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class MeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']
        read_only_fields = ['id', 'full_name']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
        }

    def get_full_name(self, obj):
        return obj.get_full_name()

    def validate_username(self, value):
        qs = User.objects.filter(username=value).exclude(pk=self.instance.pk if self.instance else None)
        if qs.exists():
            raise serializers.ValidationError('Username is already taken.')
        return value
