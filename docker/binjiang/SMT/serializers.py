# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import *
import traceback
from DeviceManage.models import MepSystemType
from ModelManage.models import ModelUrl
try:
    mem = MepSystemType.objects.get(name=u"安防系统")
    modelurl = ModelUrl.objects.get(urltype1="mepsystemtype",urlid=mem.id)
except:
    pass
class CameraTypeSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = CameraType
        fields = '__all__'

class CameraSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    ctype = CameraTypeSerializer(read_only=True)
    modeldbid = serializers.SerializerMethodField()
    guid = serializers.ReadOnlyField(source='model.guid')
    addr = serializers.SerializerMethodField()
    def get_addr(self,obj):
        try:
            user = self.context['request'].user
            if user.is_authenticated() and user.User.role.name=='院长':
                return aes.decrypt(obj.addr).split('6713')[1]
            else:
                return ''
        except:
            traceback.print_exc()
            return ''
    def get_modeldbid(self,obj):
        return {'cameradbid':obj.dbid()} 
        # model__ModelUrl =  self.context['request'].query_params.get('model__ModelUrl',None)
        # if obj.model:
        #     return obj.model.dbid(model__ModelUrl)
        # else:
        #     return None
    class Meta:
        model = Camera
        fields = '__all__'


class PeopleSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    class Meta:
        model = People
        fields = '__all__'
