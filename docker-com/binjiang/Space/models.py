# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import json
import urllib2
# Create your models here.
# -*- coding: utf-8 -*-
from django.utils.html import format_html
import traceback

class Facility(models.Model):
    '''单位工程 '''
    buildnum = models.CharField(max_length=64,verbose_name=u'楼号',null=True)
    name = models.CharField(max_length=64,verbose_name=u'名称',null=True)
    area = models.CharField(max_length=64,verbose_name=u'建筑面积',null=True,default='0')
    cost = models.CharField(max_length=64,verbose_name=u'工程造价',null=True)
    typed = models.CharField(max_length=64,verbose_name=u'工程类型',null=True)
    builder = models.CharField(max_length=64,verbose_name=u'建设单位',null=True)
    constrator = models.CharField(max_length=64,verbose_name=u'施工单位',null=True)
    supervisor = models.CharField(max_length=64,verbose_name=u'监理单位',null=True)
    piuTime = models.DateTimeField(verbose_name=u'投入使用时间',null=True)
    project_url = models.CharField(max_length=256,verbose_name=u'项目网址',null=True)
    summary = models.TextField(verbose_name=u'项目简介',null=True)
    # project = models.ForeignKey(Prj,verbose_name=u'项目',null=True)
    # asset = models.ForeignKey('AssetManage.Asset',verbose_name=u'资产id',null=True)
    # model = models.ForeignKey('ModelManage.PrecastBeam',blank=True,null=True)
    sequence = models.IntegerField(verbose_name=u'排序字段',default=0)
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '楼宇'
        verbose_name_plural = '楼宇'
        db_table = 'SpaceManage_facility'

# 空间
class Floor(models.Model):
    '''楼层'''
    name = models.CharField(max_length=64,verbose_name=u'楼层名称')
    level = models.CharField(max_length=64,verbose_name=u'标高')
    sign = models.CharField(max_length=64,verbose_name=u'标记')
    facility = models.ForeignKey(Facility,verbose_name=u'单位工程',null=True,blank=True)
    coefficient = models.DecimalField(max_digits=5,decimal_places=2,verbose_name=u'系数',null=True,blank=True)
    description = models.TextField(verbose_name=u'楼层描述')
    area = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'面积',null=True,blank=True)
    model = models.ForeignKey('ModelManage.PrecastBeam',blank=True,null=True,related_name='Floor')
    def __str__(self):
        return self.name


    class Meta:
        db_table = 'SpaceManage_floor'
        verbose_name = '建筑面积/实际使用面积'
        verbose_name_plural = '建筑面积/实际使用面积'


class Room(models.Model):
    from decimal import Decimal
    '''房间'''
    name = models.CharField(max_length=64,verbose_name=u'房间号')
    number = models.CharField(max_length=20,verbose_name=u'房间编号',null=True,blank=True)
    NetArea = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'使用面积',null=True,blank=True)
    GrossArea = models.DecimalField(max_digits=10,decimal_places=2,verbose_name=u'建筑面积',null=True,blank=True)
    rent = models.DecimalField(max_digits=7,decimal_places=2,verbose_name=u'租金',null=True,blank=True)
    remark = models.CharField(max_length=64,verbose_name=u'备注',null=True,blank=True)
    floor = models.ForeignKey(Floor,verbose_name=u'楼层ID',null=True,blank=True,related_name='Room')
    roomTag = models.CharField(max_length=64,verbose_name=u'房间标记',null=True,blank=True)
    # model = models.ForeignKey('ModelManage.PrecastBeam',verbose_name=u'构件',null=True,blank=True)
    # modelguid = models.CharField(max_length=64,verbose_name=u'构件guid',null=True,blank=True)
    # room_guid = models.CharField(max_length=64,verbose_name=u'room_guid',null=True,blank=True)
    # modeldbid = models.CharField(max_length=64,verbose_name=u'构件dbid',null=True,blank=True)
    # floordbid = models.CharField(max_length=64,verbose_name=u'floor构件dbid',null=True,blank=True)
    # asset = models.ForeignKey('AssetManage.Asset',verbose_name=u'资产id',null=True)
    # pbposition_x=models.CharField(max_length=64,unique=True,verbose_name='构件位置x',null=True,blank=True)
    # pbposition_y=models.CharField(max_length=64,unique=True,verbose_name='构件位置y',null=True,blank=True)
    # pbposition_z=models.CharField(max_length=64,unique=True,verbose_name='构件位置z',null=True,blank=True)
    # nearestCamera = models.ForeignKey('SMT.Camera',verbose_name='最近的摄像头',null=True,blank=True,related_name='nearestRoom', on_delete=models.SET_NULL)
    def __str__(self):
        return self.Name+self.number

    class Meta:
        db_table = 'SpaceManage_room'
