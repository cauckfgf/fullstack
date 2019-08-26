# -*- coding: utf-8 -*-
from django.db import models
import traceback
# Create your models here.


class CameraType(models.Model):
    """摄像头类型"""
    name = models.CharField(
        max_length=64, verbose_name='类型名称', null=True, blank=True)
    type = models.CharField(
        max_length=64, verbose_name='规格', null=True, blank=True)
    dataype = models.CharField(
        max_length=64, verbose_name='数据类型', null=True, blank=True)
    port = models.CharField(
        max_length=64, verbose_name='端口', null=True, blank=True)
    brand = models.CharField(
        max_length=64, verbose_name='品牌', null=True, blank=True)
    # supplier = models.ForeignKey('User.Company', null=True, blank=True)

    power = models.CharField(
        max_length=64, verbose_name='电源', null=True, blank=True)
    ccd = models.CharField(
        max_length=64, verbose_name='ccd', null=True, blank=True)
    lens = models.CharField(
        max_length=64, verbose_name='镜头', null=True, blank=True)
    ratio = models.CharField(
        max_length=64, verbose_name='分辨率', null=True, blank=True)
    temperature = models.CharField(
        max_length=64, verbose_name='工作温度', null=True, blank=True)
    humidity = models.CharField(
        max_length=64, verbose_name='工作湿度', null=True, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = 'SMT_CameraType'


class Camera(models.Model):
    '''摄像头'''
    CHOICE = (
        (1, '在线'),
        (0, '不在线')
    )
    name = models.CharField(max_length=64, verbose_name='摄像头名字')
    code = models.CharField(max_length=64, verbose_name='摄像头编码')
    ctype = models.ForeignKey(CameraType, null=True, blank=True)
    floor = models.ForeignKey('Space.Floor', null=True, blank=True)
    room = models.ForeignKey('Space.Room', null=True, blank=True, related_name='Camera')
    datatype = models.CharField(max_length=64, verbose_name='摄像头数据类型',default='')
    addr = models.TextField(max_length=128, verbose_name='访问地址',default='')
    ip = models.CharField(
        max_length=128, verbose_name='ip地址', null=True, blank=True)
    cameraUuid = models.CharField(
        max_length=128, verbose_name='摄像机对应海康8700cameraUuid', null=True, blank=True)
    onLineStatus = models.IntegerField(
        default=1, verbose_name='是否在线', choices=CHOICE)
    create_datetime = models.DateTimeField("创建时间", auto_now_add=True)
    last_update_datetime = models.DateTimeField("最后修改时间", auto_now=True)

    # zone = models.ManyToManyField('SpaceManage.Zone',blank=True,verbose_name='分区')

    def __unicode__(self):
        return self.name

    class Meta:
        db_table = 'SMT_Camera'


class People(models.Model):
    camera = models.ForeignKey(Camera,null=True,blank=True)
    footfallStartTime = models.DateTimeField(verbose_name='客流开始时间',null=True,blank=True)
    footfallEndTime = models.DateTimeField(max_length=64,verbose_name='客流结束时间',null=True,blank=True)
    footfallTime = models.CharField(max_length=64,verbose_name='客流时间',null=True,blank=True)
    passengersIn = models.IntegerField(verbose_name='进客流量',null=True,blank=True)
    passengersOut = models.IntegerField(verbose_name='出客流量',null=True,blank=True)
    class Meta:
        db_table = 'SMT_peole'