# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import json
import urllib2
# Create your models here.

# class System(models.Model):
#     '''系统'''
#     name = models.CharField(max_length=96,default='系统名字',verbose_name='名字')
#     create_time = models.DateTimeField(auto_now_add=True)
#     # devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')

#     def __unicode__(self):
#         return self.name

#     class Meta:
#         verbose_name = '系统'
#         verbose_name_plural = '系统'
#         db_table = 'Device_System'



class DeviceType(models.Model):
    '''设备类型'''
    name = models.CharField(max_length=96,default='未命名设备类型',verbose_name='类型名称')

    def __unicode__(self):
        return self.name
    class Meta:
        verbose_name = '设备类型'
        verbose_name_plural = '设备类型'
        db_table = 'Device_DeviceType'

class Device(models.Model):

    name = models.CharField(max_length=96,default='未命名设备',verbose_name='名字')
    status = models.IntegerField(default=1,verbose_name='状态')#1正常 2报警 或者开关关闭
    devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')
    # system = models.ForeignKey(System,blank=True,null=True,verbose_name='设备所属系统')
    isrun = models.BooleanField(default=False,verbose_name='是否显示动态图')
    areax = models.CharField(max_length=96,default='',verbose_name='x坐标')
    areay = models.CharField(max_length=96,default='',verbose_name='y坐标')
    code = models.CharField(max_length=96,default='',verbose_name='设备编码')
    def __unicode__(self):
        return self.name

    def sensors(self):
        return Sensor.objects.filter(device=self).order_by('-status').values('name','lastdata','unit','status','id')
    class Meta:
        verbose_name = '设备'
        verbose_name_plural = '设备'
        db_table = 'Device_Device'



class Sensor(models.Model):
    name = models.CharField(max_length=96,default='点位名字',verbose_name='点位名字')
    lastdata = models.CharField(max_length=96,default='最新数值',verbose_name='最新数值',null=True,blank=True)
    device = models.ForeignKey('Device',null=True,verbose_name='设备',related_name='Sensor')
    unit = models.CharField(max_length=96,null=True,blank=True,default='℃',verbose_name='点位单位')
    isnumber = models.BooleanField(default=True,verbose_name='是否是数值量')
    status = models.IntegerField(default=1,verbose_name='状态') #1正常 2报警


    def __unicode__(self):
        return "{}:{}".format(self.name,self.lastdata)

    class Meta:
        verbose_name = '传感器'
        verbose_name_plural = '传感器'
        db_table = 'Device_Sensor'


class SensorData(models.Model):
    """传感器监测数据"""
    sensor = models.ForeignKey(Sensor)
    data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
    stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
    mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')
    class Meta:
        db_table = 'Device_SensorData'
