# -*- coding: utf-8 -*-
from rest_framework import serializers
import os
from models import *

class FileSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    file = serializers.SerializerMethodField()
    def get_file(self,obj):
        return  os.path.join("/media/",str(obj.file))
    class Meta:
        model = File
        fields = '__all__'
