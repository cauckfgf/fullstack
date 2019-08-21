# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *


        
class ConfigSerializer(serializers.ModelSerializer):
    '''设备类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = Config
        fields = '__all__'
        