# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *

class DeviceTypeSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = DeviceType
        fields = '__all__'
