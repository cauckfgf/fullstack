# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User 
# from auditlog.registry import auditlog
# from User.models import Department
# Create your models here.



class Config(models.Model):
    """docstring for ClassName"""
    config = models.TextField(null=True,blank=True)
    appid = models.CharField(max_length=64,verbose_name='微信appid',default='')
    psw = models.CharField(max_length=64,verbose_name='微信公众号密码',default='')
    yuming = models.CharField(max_length=255,verbose_name='域名',default='')
    color = models.CharField(max_length=255,verbose_name='颜色',default='')
    front = models.CharField(max_length=255,verbose_name='字体',default='')

    def __str__(self):
        return "系统配置"
        
    class Meta:
        verbose_name = "系统配置"
        verbose_name_plural = "系统配置"

class Auth(models.Model):
    name = models.CharField(max_length=64,verbose_name='权限名字',default='')
    users = models.ManyToManyField(User,verbose_name='有权限的用户',blank=True)

    def users_name(self):
        return ','.join(self.users.values_list('username',flat=True))
    class Meta:
        verbose_name = "权限"
        verbose_name_plural = "权限"
