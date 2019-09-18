# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import json
import urllib2
from dateutil.relativedelta import relativedelta
import datetime 
import os,traceback
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
    stime = models.DateTimeField(verbose_name='记录时间')
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

class AlarmType(models.Model):
    key = models.CharField(max_length=96,default='对方公司起的名字',verbose_name='对方公司起的名字')
    name =  models.CharField(max_length=96,default='名字',verbose_name='名字')
    class Meta:
        db_table = 'XGWK_AlarmType'


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


# 用电
class EnergyCategory(models.Model):
    '''电能监测分类'''
    name = models.CharField(max_length=120,verbose_name='分项名称')
    # mepsystemtype= models.ForeignKey('DeviceManage.MepSystemType',verbose_name='所属机电系统id',blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '电能监测分类'
        verbose_name_plural = '电能监测分类'
        db_table = 'energymanage_electricity_category'


class CategoryItem(models.Model):
    '''电能监测一级分项'''
    name = models.CharField(max_length=120,verbose_name='一级分项名称')
    category= models.ForeignKey(EnergyCategory,verbose_name='所属电能分项',blank=True, null=True)
    # mep_system= models.ForeignKey('DeviceManage.MepSystem',verbose_name='关联机电系统',blank=True, null=True)
    # device_type= models.ForeignKey('DeviceManage.DeviceType',verbose_name='关联机电设备类型',blank=True, null=True)
    # department = models.ForeignKey('User.Department',verbose_name='部门',blank=True, null=True)
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '电能监测分类项目'
        verbose_name_plural = '电能监测分类项目'
        db_table = 'energymanage_electricity_firstlevel'

class EndlevelItem(models.Model):
    '''电能监测二级分项'''
    name = models.CharField(max_length=120,verbose_name='分项名称')
    category_item= models.ForeignKey(CategoryItem,verbose_name='所属分类项目id',blank=True, null=True)
    # device_type= models.ForeignKey('DeviceManage.DeviceType',verbose_name='关联机电设备类型',blank=True, null=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = '电能监测二级分项'
        verbose_name_plural = '电能监测二级分项'
        db_table = 'energymanage_electricity_endlevel'

class Circuit(models.Model):
    '''回路表'''
    number = models.IntegerField(verbose_name='回路编号',blank=True, null=True)
    Instrument_number = models.CharField(max_length=120,verbose_name='仪表编号',default='')
    name = models.CharField(max_length=120,verbose_name='回路名称',default='')
    describe = models.CharField(max_length=120,verbose_name='回路描述',default='')
    is_spare = models.BooleanField(default=False,verbose_name='使用状态（是否备用')
    quantity =  models.DecimalField(max_digits=10,decimal_places=2,verbose_name='回路额定用电量',blank=True, null=True)
    quantity_unit = models.CharField(max_length=120,verbose_name='回路用电量单位',default='kw')
    # zone = models.ForeignKey('SpaceManage.Zone',verbose_name='回路区域',blank=True, null=True)
    # floor = models.ManyToManyField('SpaceManage.Floor',verbose_name='回路区域')
    # cabinet =  models.IntegerField(verbose_name='箱柜编号',blank=True, null=True)
    cabinet_number = models.CharField(max_length=120,verbose_name='箱柜编号',blank=True, null=True)
    branch_number = models.CharField(max_length=120,verbose_name='支路编号',blank=True, null=True)
    magnification = models.CharField(max_length=120,verbose_name='回路倍率',default='1')
    control_cabinet = models.CharField(max_length=120,verbose_name='上级柜号',blank=True, null=True)
    # room = models.ForeignKey('SpaceManage.Room',verbose_name='所属配电间',blank=True, null=True)
    # belong_device = models.ForeignKey('DeviceManage.Device',related_name='Device3',verbose_name='所属设备箱',blank=True, null=True)
    meter_address =  models.IntegerField(verbose_name='表地址',blank=True, null=True)
    endlevel = models.ForeignKey(EndlevelItem,verbose_name='二级分项',blank=True, null=True)
    firstlevel = models.ForeignKey(CategoryItem,verbose_name='一级分项',blank=True, null=True)
    # devices = models.ManyToManyField('DeviceManage.Device',related_name='Circuit1',verbose_name='配电箱')
    # floors = models.ManyToManyField('SpaceManage.Floor',related_name='Circuit2')
    # cabinet  = models.ForeignKey('DeviceManage.Device',verbose_name='配电柜',related_name='Circuit3',blank=True, null=True)
    status = models.BooleanField(default=False,verbose_name='回路状态')#False 正常
    ip = models.CharField(max_length=15, blank=True,null=True,verbose_name='采集IP地址')
    port = models.IntegerField(default=0,blank=True,null=True)
    address = models.IntegerField(blank=True,null=True,verbose_name='寄存器地址')
    busy_start = models.TimeField(default='08:00:00')
    busy_end = models.TimeField(default='20:00:00')
    ref_power_density = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'标准功率密度',null=True,blank=True)
    lastdata = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'功',null=True,blank=True)
    code = models.CharField(max_length=96,default='',verbose_name='设备编码')
    # facility = models.ForeignKey('PrjManage.Facility', blank=True, null=True)

    def __str__(self):
        return name

    def getALL(self,start,end):
        c = CircuitMonitorData.objects.filter(time__range=(start,end),Circuit=self)
        l = c.count()
        if l>0:
            # rdata = round(float(c[0].power),2)
            return c.last().quantity - c.first().quantity
        else:
            return 0



    def month(self,t=None):
        #每月统计，或者t月份的统计
        if t:
            # t = '2018-2'
            # end = datetime.datetime.strptime(t,'%Y-%m')
            end = t
        else:
            end = datetime.datetime.now()
        start = end + relativedelta(months=-1)
        return self.getALL(start, end)

    def day(self,t=None):
        if t:
            # t = '2018-2-4'
            # end = datetime.datetime.strptime(t,'%Y-%m-%d')
            end = t
        else:
            end = datetime.datetime.now()
        start = end + relativedelta(days=-1)
        return self.getALL(start, end)

    def hour(self,t=None):
        if t:
            # t = '2018-2-4 15'
            # end = datetime.datetime.strptime(t,'%Y-%m-%d %H')
            end = t
        else:
            end = datetime.datetime.now()
        start = end + relativedelta(hours=-1)
        data = self.getALL(start, end)
        return data

    class Meta:
        verbose_name = '回路表'
        verbose_name_plural = '回路表'
        db_table = 'energymanage_electricity_circuit'


class CircuitMonitorData(models.Model):
    circuit = models.ForeignKey(Circuit,verbose_name='回路区域')
    quantity = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'功',null=True,blank=True)
    power = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'功率',null=True,blank=True)
    voltage_A = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'A相电压读数',null=True,blank=True)
    voltage_B = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'B相电压读数',null=True,blank=True)
    voltage_C = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'C相电压读数',null=True,blank=True)
    current_A = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'A相电流读数',null=True,blank=True)
    current_B = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'B相电流读数',null=True,blank=True)
    current_C = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'C相电流读数',null=True,blank=True)
    time = models.DateTimeField()
    istrue = models.BooleanField(verbose_name='是否是真实数据(异常数据平均值)',default=True)

    def A(self):
        return self.voltage_A * self.current_A

    def B(self):
        return self.voltage_B * self.current_B

    def C(self):
        return self.voltage_C * self.current_C


    def __str__(self):
        return self.circuit.name
    
    class Meta:
        verbose_name = '回路监测表'
        verbose_name_plural = '回路监测表'
        db_table = 'energymanage_electricity_circuit_monitor_data'

class MonitorDataTime(models.Model):
    CHOICES= (
        ('hour', 'hour'),
        ('day', 'day'),
        ('month', 'month'),
    )
    Circuit = models.ForeignKey(Circuit,verbose_name='电表',null=True,blank=True)
    CategoryItem = models.ForeignKey(CategoryItem,verbose_name='一级分项',null=True,blank=True)
    EnergyCategory = models.ForeignKey(EnergyCategory,verbose_name='电能监测分类',null=True,blank=True)
    # WaterCirruit = models.ForeignKey(WaterCirruit,verbose_name='水表',null=True,blank=True)
    time = models.DateTimeField(auto_now_add=True)
    # time = models.DateTimeField(null=True,blank=True,default='2020-09-08 00:00:00')
    D_value = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'差值',null=True,blank=True)
    power = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'功率',null=True,blank=True)
    type = models.CharField(max_length=12,choices=CHOICES,verbose_name='类型')
    power_density = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'功率密度',null=True,blank=True)

    def __str__(self):
        if self.Circuit:
            return self.Circuit.name
        elif self.EnergyCategory:
            return self.EnergyCategory.name
        elif self.CategoryItem:
            return self.CategoryItem.name
        else:
            return ''

    def name(self):
        return self.__str__()
        
    class Meta:
        verbose_name = '水电表中间数据'
        verbose_name_plural = '水电表中间数据'
        db_table = 'energymanage_MonitorDataTime'


class S_Device(models.Model):
    # 四建
    code = models.CharField(max_length=96,default='',verbose_name='设备编码')
    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = '设备'
        verbose_name_plural = '设备'
        db_table = 'devicemanage_device'

class S_Sensor(models.Model):
    name = models.CharField(max_length=96,default='点位名字',verbose_name='点位名字')
    lastdata = models.CharField(max_length=96,default='最新数值',verbose_name='最新数值',null=True,blank=True)
    device = models.ForeignKey('S_Device',null=True,verbose_name='设备',related_name='Sensor')
    key = models.CharField(max_length=96,default='对方公司起的名字',verbose_name='对方公司起的名字')
    def __unicode__(self):
        return "{}:{}".format(self.name,self.lastdata)

    class Meta:
        verbose_name = '传感器'
        verbose_name_plural = '传感器'
        db_table = 'devicemanage_sensor'



class S_SensorDataTime(models.Model):
    """传感器监测数据"""
    STATUS_CHOICES = (
        (1, '1一级报警'),
        (2, '2二级报警'),
        (3, '3三级报警'),
        (4, '4中断'),
        (5, '5正常'),
    )
    sensor = models.ForeignKey(S_Sensor)
    data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
    stime = models.DateTimeField(auto_now_add=True,verbose_name='记录时间', db_index=True)
    mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记',choices=STATUS_CHOICES)
    station = models.CharField(max_length=96, blank=True, null=True)
    class Meta:
        db_table = 'devicemanage_sensordatatime'