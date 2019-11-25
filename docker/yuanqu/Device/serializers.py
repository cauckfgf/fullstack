# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *
import json


class ProjectSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    value = serializers.ReadOnlyField()
    users_name = serializers.SerializerMethodField()
    def get_users_name(self,obj):
        return ','.join(obj.users.values_list('username',flat=True))
    class Meta:
        model = Project
        fields = '__all__'

class SystemTypeSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    class Meta:
        model = SystemType
        fields = '__all__'

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

class Jsonserializer(serializers.JSONField):

    def to_representation(self, value):
        try:
            return json.loads(value)
        except:
            return ''
 
    def to_internal_value(self, data):
        print data,type(data)
        try:
            print data
            json.loads(data)
            return data
        except (TypeError, ValueError):
            # self.fail('invalid_json')
            return data



class DeviceSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    devicetype_name = serializers.ReadOnlyField(source='devicetype.name')
    system_name = serializers.ReadOnlyField(source='system.name')
    postion = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()
    gif = serializers.SerializerMethodField()
    sensors = serializers.ReadOnlyField()
    sizeXY = serializers.SerializerMethodField()
    showname = serializers.ReadOnlyField()
    lastdata = Jsonserializer(required=False)
    editabe = serializers.SerializerMethodField()
    _checked = serializers.SerializerMethodField()
    _disabled = serializers.SerializerMethodField()
    def get__checked(self,obj):
        user =  self.context['request'].user
        if user.is_authenticated():
            if obj.users.filter(id=user.id):
                return True
            return False
        else:
            return False

    def get__disabled(self,obj):
        user =  self.context['request'].user
        if user.is_authenticated():
            return False
        else:
            return True

    def get_sizeXY(self,obj):
        xy = obj.size.split(',')
        return {
            'x':xy[0],
            'y':xy[1]
        } 

    def get_editabe(self,obj):
        return True
        # user =  self.context['request'].user
        # if user and obj.user and  obj.user.username==user.username:
        #     return True
        # return False

    def get_postion(self,obj):
        def toInt(i):
            return int(float(i))
        # return Document.objects.filter(docdirectory__name=self.name)
        system = self.context['request'].query_params.get('system',None)
        if system:
            p1 = Device2Device.objects.filter(device_from=obj,system_id=system).first()
            
            if p1:
                return map(toInt,p1.position_from.split(','))
            p2 = Device2Device.objects.filter(device_to=obj,system_id=system).first()
            if p2:
                return map(toInt,p2.position_to.split(','))
        return [100,100]
    def get_gif(self,obj):
        devicetype = obj.devicetype
        if devicetype and devicetype.gif:
            return devicetype.gif.url
        return ''
        
    def get_icon(self,obj):
        devicetype = obj.devicetype
        l = []
        if devicetype:
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

class SensorDataSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    stime = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, read_only=True)
    class Meta:
        model = SensorData
        fields = '__all__'

class TimerTuYaSerializer(serializers.ModelSerializer):
    '''备品备件类型'''
    id = serializers.ReadOnlyField()
    data = Jsonserializer()
    # def create(self, validated_data):
    #     describe = validated_data['describe']
    #     d = self.context['request'].data
    #     t = TimerTuYa.objects.create(data=d.get('data'),describe=describe)
    #     return t
    class Meta:
        model = TimerTuYa
        fields = '__all__'
