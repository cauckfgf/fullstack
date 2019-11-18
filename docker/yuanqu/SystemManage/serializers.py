# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User 

        
class ConfigSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = Config
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = ['id','username','last_login','is_staff','is_superuser','groups','user_permissions']
        # fields = '__all__'