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
#         db_table = 'XGWK_System'

# class DeviceCategory(models.Model):
#     '''设备大类型'''
#     name = models.CharField(max_length=96, blank=True,verbose_name='类型名称')
    
#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = '设备类别'
#         verbose_name_plural = '设备类别'
#         db_table = 'XGWK_DeviceCategory'

class DeviceType(models.Model):
    '''设备类型'''
    name = models.CharField(max_length=96,default='未命名设备类型',verbose_name='类型名称')
    # XGWK_category  = models.ForeignKey(DeviceCategory,blank=True,null=True, verbose_name='设备类别')
    def __unicode__(self):
        return self.name
    class Meta:
        verbose_name = '设备类型'
        verbose_name_plural = '设备类型'
        db_table = 'XGWK_DeviceType'

class Device(models.Model):

    name = models.CharField(max_length=96,default='未命名设备',verbose_name='名字')
    status = models.IntegerField(default=1,verbose_name='状态')#1正常 2报警 或者开关关闭
    devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')
    # system = models.ForeignKey(System,blank=True,null=True,verbose_name='设备所属系统')
    isrun = models.BooleanField(default=False,verbose_name='是否显示动态图')
    areax = models.CharField(max_length=96,default='',verbose_name='x坐标')
    areay = models.CharField(max_length=96,default='',verbose_name='y坐标')
    code = models.CharField(max_length=96,default='',verbose_name='设备编码')
    structureName = models.CharField(max_length=96,default='',verbose_name='点位名称')
    create_datetime = models.DateTimeField(verbose_name="创建时间", auto_now_add=True)
    last_update_datetime = models.DateTimeField(verbose_name="最后修改时间", auto_now=True)
    def __unicode__(self):
        return self.name

    def sensors(self):
        return Sensor.objects.filter(device=self).order_by('-status').values('name','lastdata','unit','status','id')
    class Meta:
        verbose_name = '设备'
        verbose_name_plural = '设备'
        db_table = 'XGWK_Device'



class Sensor(models.Model):
    name = models.CharField(max_length=96,default='点位名字',verbose_name='点位名字')
    lastdata = models.CharField(max_length=96,default='最新数值',verbose_name='最新数值',null=True,blank=True)
    device = models.ForeignKey('Device',null=True,verbose_name='设备',related_name='Sensor')
    unit = models.CharField(max_length=96,null=True,blank=True,default='',verbose_name='点位单位')
    isnumber = models.BooleanField(default=True,verbose_name='是否是数值量')
    status = models.IntegerField(default=1,verbose_name='状态') #1正常 2报警
    create_datetime = models.DateTimeField("创建时间", auto_now_add=True)
    last_update_datetime = models.DateTimeField("最后修改时间", auto_now=True)
    key = models.CharField(max_length=96,default='对方公司起的名字',verbose_name='对方公司起的名字')
    range11 = models.CharField(max_length=16,verbose_name=u'一级报警上线',null=True,blank=True)
    range12 = models.CharField(max_length=16,verbose_name=u'一级报警下线',null=True,blank=True)
    range21 = models.CharField(max_length=16,verbose_name=u'二级报警上线',null=True,blank=True)
    range22 = models.CharField(max_length=16,verbose_name=u'二级报警下线',null=True,blank=True)
    range31 = models.CharField(max_length=16,verbose_name=u'三级报警上线',null=True,blank=True)
    range32 = models.CharField(max_length=16,verbose_name=u'三级报警下线',null=True,blank=True)
    def __unicode__(self):
        return "{}:{}".format(self.name,self.lastdata)

    class Meta:
        verbose_name = '传感器'
        verbose_name_plural = '传感器'
        db_table = 'XGWK_Sensor'


class SensorData(models.Model):
    """传感器监测数据"""
    sensor = models.ForeignKey(Sensor)
    data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
    stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
    mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

    class Meta:
        db_table = 'XGWK_SensorData'

class SensorDataTime(models.Model):
    """传感器监测数据"""
    STATUS_CHOICES = (
        (1, '1一级报警'),
        (2, '2二级报警'),
        (3, '3三级报警'),
        (4, '4中断'),
        (5, '5正常'),
    )
    sensor = models.ForeignKey(Sensor)
    data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
    stime = models.DateTimeField(verbose_name='记录时间', db_index=True)
    mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记',choices=STATUS_CHOICES)
    station = models.CharField(max_length=96, blank=True, null=True)
    class Meta:
        db_table = 'XGWK_sensordatatime'

# class SensorDataFull(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True,null=True,verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True,verbose_name='记录时间',db_index=True)
#     mark = models.CharField(max_length=96, blank=True,null=True,verbose_name='标记')
#     def dbid(self):
#         try:
#             return self.sensor.pbelement.dbid()
#         except:
#             traceback.print_exc()
#             return None
#     def sensorname(self):
#         return self.sensor.name

#     class Meta:
#         verbose_name = '历史数据'
#         unique_together=("id","stime")
#         db_table = 'devicemanage_sensordata_all'

# class SensorData_DeviceType1(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
#     mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

#     class Meta:
#         db_table = 'XGWK_SensorData_DeviceType1'

# class SensorData_DeviceType2(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
#     mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

#     class Meta:
#         db_table = 'XGWK_SensorData_DeviceType2'

# class SensorData_DeviceType3(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
#     mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

#     class Meta:
#         db_table = 'XGWK_SensorData_DeviceType3'

# class SensorData_DeviceType4(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
#     mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

#     class Meta:
#         db_table = 'XGWK_SensorData_DeviceType4'

# class SensorData_DeviceType5(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
#     mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

#     class Meta:
#         db_table = 'XGWK_SensorData_DeviceType5'

# class SensorData_DeviceType6(models.Model):
#     """传感器监测数据"""
#     sensor = models.ForeignKey(Sensor)
#     data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
#     stime = models.DateTimeField(auto_now_add=True, verbose_name='记录时间')
#     mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

#     class Meta:
#         db_table = 'XGWK_SensorData_DeviceType6'

# class AlarmType(models.Model):
#     key = models.CharField(max_length=96,default='对方公司起的名字',verbose_name='对方公司起的名字')
#     name =  models.CharField(max_length=96,default='名字',verbose_name='名字')
#     class Meta:
#         db_table = 'XGWK_AlarmType'


# class Alarm(models.Model):
#     create_time = models.DateTimeField(verbose_name="创建时间", auto_now_add=True)
#     alarm_level =  models.IntegerField(default=0,verbose_name='告警级别')
#     sensor = models.ForeignKey(Sensor)
#     abi_time =  models.IntegerField(default=0,verbose_name='持续时间')
#     class Meta:
#         db_table = 'XGWK_Alarm'
# class Camera(models.Model):
#     '''摄像头'''
#     CHOICE = (
#         (1,'在线'),
#         (0,'不在线')
#     )
#     name = models.CharField(max_length=64,verbose_name='摄像头名字')
#     code = models.CharField(max_length=64,verbose_name='摄像头编码')
#     ctype = models.ForeignKey(CameraType,null=True,blank=True)
#     floor = models.ForeignKey('SpaceManage.Floor',null=True,blank=True)
#     room = models.ForeignKey('SpaceManage.Room',null=True,blank=True,related_name='Camera')
#     datatype = models.CharField(max_length=64,verbose_name='摄像头数据类型')
#     asset = models.ForeignKey('AssetManage.Asset',verbose_name=u'资产id',null=True)
#     addr = models.TextField(max_length=128,verbose_name='访问地址')
#     ip = models.CharField(max_length=128,verbose_name='ip地址',null=True,blank=True)
#     model = models.ForeignKey('ModelManage.PrecastBeam',verbose_name=u'构件',null=True,blank=True)
#     ModelUrl2Model = models.ForeignKey('ModelManage.ModelUrl2Model',verbose_name=u'构件模型对应',null=True,blank=True)
#     cameraUuid = models.CharField(max_length=128,verbose_name='摄像机对应海康8700cameraUuid',null=True,blank=True)
#     onLineStatus = models.IntegerField(default=1,verbose_name='是否在线',choices=CHOICE)

#     # zone = models.ManyToManyField('SpaceManage.Zone',blank=True,verbose_name='分区')
#     def dbid(self):
#         return self.model.cameradbid()
#     def __unicode__(self):
#         return self.name
#     class Meta:
#         db_table = 'XGWK_Camera'
