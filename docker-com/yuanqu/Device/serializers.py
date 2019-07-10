# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *

class SystemSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = System
        fields = '__all__'

class DeviceTypeSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = DeviceType
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    postion = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()
    sensors = serializers.ReadOnlyField()

    def get_postion(self,obj):
        # return Document.objects.filter(docdirectory__name=self.name)
        system = self.context['request'].query_params.get('system',None)
        if system:
            p1 = Device2Device.objects.filter(device_from=obj,system_id=system).first()
            
            if p1:
                return map(int,p1.position_from.split(','))
            p2 = Device2Device.objects.filter(device_to=obj,system_id=system).first()
            if p2:
                return map(int,p2.position_to.split(','))
        return []
    def get_icon(self,obj):
        devicetype = obj.devicetype
        l = []
        if devicetype.icon1:
            l.append(devicetype.icon1.url)
        if devicetype.icon2:
            l.append(devicetype.icon2.url)
        if devicetype.icon3:
            l.append(devicetype.icon3.url)
        return l
        # if obj.status==1:
        #     return obj.devicetype.icon1.url
        # elif obj.status==2:
        #     return obj.devicetype.icon2.url
        # elif obj.status==3:
        #     return obj.devicetype.icon3.url



    class Meta:
        model = Device
        fields = '__all__'

class Device2DeviceSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    line = serializers.ReadOnlyField()
    path_list = serializers.ListField()
    class Meta:
        model = Device2Device
        fields = '__all__'