# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User ,Group

        
class ConfigSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = Config
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    groups_name = serializers.SerializerMethodField()

    def get_groups_name(self,obj):
        return ','.join(obj.groups.values_list('name',flat=True))
    class Meta:
        model = User
        fields = ['id','username','last_login','is_staff','is_superuser','groups','user_permissions','groups_name']
        # fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = Group
        fields = '__all__'

class AuthSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = Auth
        fields = '__all__'
