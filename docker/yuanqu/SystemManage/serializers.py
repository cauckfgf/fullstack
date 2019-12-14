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


class PassSerializer(serializers.CharField):

    def to_representation(self, value):
        return ''
 
    def to_internal_value(self, data):
        # print data,type(data)
        return data

class UserSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    groups_name = serializers.SerializerMethodField()
    password = PassSerializer(required=True)
    def create(self, validated_data):
        name = validated_data['username']
        ipass = validated_data['password']
        is_staff = validated_data['is_staff']
        user = User(username=name,is_staff=is_staff)
        user.set_password(ipass) #重新set_password ，这样数据库就不是明文
        user.save()
        return user

    def get_groups_name(self,obj):
        return ','.join(obj.groups.values_list('name',flat=True))

    class Meta:
        model = User
        fields = ['id','username','last_login','is_staff','is_superuser','groups','user_permissions','groups_name','password']
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
    users_name = serializers.ReadOnlyField()
    class Meta:
        model = Auth
        fields = '__all__'
