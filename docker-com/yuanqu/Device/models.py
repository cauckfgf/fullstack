# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import json
# Create your models here.

class System(models.Model):
    '''系统'''
    name = models.CharField(max_length=96,default='系统名字',verbose_name='名字')
    create_time = models.DateTimeField(auto_now_add=True)
    # devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = '系统'
        verbose_name_plural = '系统'
        db_table = 'Device_System'



class DeviceType(models.Model):
    '''设备类型'''
    name = models.CharField(max_length=96,default='未命名设备类型',verbose_name='类型名称')
    icon1 = models.FileField(upload_to='upload/', null=True, blank=True,verbose_name='设备拓扑图状态1图标')
    icon2 = models.FileField(upload_to='upload/',null=True, blank=True,verbose_name='设备拓扑图状态2图标')
    icon3 = models.FileField(upload_to='upload/',null=True, blank=True,verbose_name='设备拓扑图状态3图标')
    gif = models.FileField(upload_to='upload/',null=True, blank=True,verbose_name='设备动态图')
    def __unicode__(self):
        return self.name
    class Meta:
        verbose_name = '设备类型'
        verbose_name_plural = '设备类型'
        db_table = 'Device_DeviceType'

class Device(models.Model):
    '''设备'''
    name = models.CharField(max_length=96,default='未命名设备',verbose_name='名字')
    status = models.IntegerField(default=1,verbose_name='状态')#1正常 2报警 或者开关关闭
    devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')
    system = models.ForeignKey(System,blank=True,null=True,verbose_name='设备所属系统')
    isrun = models.BooleanField(default=False,verbose_name='是否显示动态图')
    size = models.CharField(max_length=96,default='200,100',verbose_name='大小')
    def __unicode__(self):
        return self.name

    def sensors(self):
        return Sensor.objects.filter(device=self).order_by('-status').values('name','lastdata','unit','status','id')
    class Meta:
        verbose_name = '设备'
        verbose_name_plural = '设备'
        db_table = 'Device_Device'

class Device2Device(models.Model):
    '''设备连接'''
    device_from = models.ForeignKey(Device,related_name="DeviceFrom",verbose_name='连接设备')
    position_from = models.CharField(max_length=96,default='1,2',verbose_name='连接设备在逻辑图中位置')
    device_to = models.ForeignKey(Device,related_name="DeviceTo",verbose_name='被连接设备')
    position_to = models.CharField(max_length=96,default='1,2',verbose_name='被连接设备在逻辑图中位置')
    connection = models.CharField(max_length=96,default='连接方式1',verbose_name='连接方式')
    system = models.ForeignKey(System,blank=True,null=True,verbose_name='设备所属系统')
    sensor = models.ForeignKey('Sensor',null=True,blank=True,verbose_name='连接传感器')
    mid = models.TextField(default='',blank=True,null=True,verbose_name='线路中间点位')
    show_direction = models.BooleanField(default=True,verbose_name='是否流向')
    def path_list(self):
        def toInt(i):
            return int(float(i))
        if self.mid:
            return [map(toInt,self.position_from.split(','))] + json.loads(self.mid) + [map(toInt,self.position_to.split(','))]
        else:
            return [map(toInt,self.position_from.split(',')), map(toInt,self.position_to.split(','))]
    def __unicode__(self):
        return self.device_from.name+'-'+self.device_to.name

    def line(self):
        if self.sensor:
            return {
                'label':self.sensor.__unicode__(),
                'sensor_status': 'green' if self.sensor.status==1 else 'red'
            }
        else:
            return {
                'label':'',
                'sensor_status': self.connection
            }
    class Meta:
        verbose_name = '设备连接'
        verbose_name_plural = '设备连接'
        db_table = 'Device2Device'

class Sensor(models.Model):
    name = models.CharField(max_length=96,default='点位名字',verbose_name='点位名字')
    lastdata = models.CharField(max_length=96,default='最新数值',verbose_name='最新数值')
    device = models.ForeignKey('Device',null=True,verbose_name='设备',related_name='Sensor')
    unit = models.CharField(max_length=96,null=True,blank=True,default='℃',verbose_name='点位单位')
    isnumber = models.BooleanField(default=True,verbose_name='是否是数值量')
    status = models.IntegerField(default=1,verbose_name='状态') #1正常 2报警
    isrun = models.BooleanField(default=False,verbose_name='是否是决定设备运行停止进而影响逻辑图中是否显示动态图')
    def __unicode__(self):
        return "{}:{}".format(self.name,self.lastdata)
    class Meta:
        verbose_name = '传感器'
        verbose_name_plural = '传感器'
        db_table = 'Device_Sensor'