# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class DeviceType(models.Model):
    '''设备类型'''
    name = models.CharField(max_length=96,default='未命名设备类型',verbose_name='类型名称')
    icon = models.FileField(null=True, blank=True,verbose_name='设备拓扑图图标')
    class Meta:
        verbose_name = '设备类型'
        verbose_name_plural = '设备类型'
        db_table = 'Device_DeviceType'

class Device(models.Model):
    '''设备'''
    name = models.CharField(max_length=96,default='未命名设备',verbose_name='名字')
    devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')
    class Meta:
        verbose_name = '设备类型'
        verbose_name_plural = '设备类型'
        db_table = 'Device_Device'