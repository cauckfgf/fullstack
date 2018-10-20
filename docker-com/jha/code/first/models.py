# -*- coding: utf-8 -*-
from __future__ import absolute_import
from django.db import models
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
# from django.utils.encoding import python_2_unicode_compatible
# Create your models here.
class File(models.Model):
    file = models.FileField(upload_to="./")


# @python_2_unicode_compatible
class News(models.Model):
    # 实时新闻资讯
    T_CHOICES = (
        (1, '企业新闻'),
        (2, '公司新闻'),
    )
    titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='新闻标题')
    txt = RichTextUploadingField(verbose_name='新闻内容')
    en_titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='新闻标题英文')
    en_txt = RichTextUploadingField(verbose_name='新闻内容英文')
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='日期')
    images = models.ManyToManyField(File,verbose_name='新闻图片')
    t = models.IntegerField(verbose_name='企业新闻/公司新闻',default=1,choices=T_CHOICES)


class Scope(models.Model):
    # 业务范围
    titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题')
    txt = RichTextUploadingField(verbose_name='业务范围内容')
    en_titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题英文')
    en_txt = RichTextUploadingField(verbose_name='业务范围内容英文')
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='日期')
    images = models.ManyToManyField(File,verbose_name='业务范围图片')

class Leader(models.Model):
    # 业务范围
    name = models.CharField(max_length=200, blank=True, null=True,verbose_name='名字')
    position = models.CharField(max_length=200, blank=True, null=True,verbose_name='职位')
    txt = models.TextField(blank=True, null=True,verbose_name='内容')
    en_name = models.CharField(max_length=200, blank=True, null=True,verbose_name='名字')
    en_position = models.CharField(max_length=200, blank=True, null=True,verbose_name='职位')
    en_txt = models.TextField(blank=True, null=True,verbose_name='职位')
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='内容')
    images = models.ManyToManyField(File,verbose_name='业务范围图片')

class Other(models.Model):
    # 公司简介 
    titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题')
    txt = models.TextField(blank=True, null=True,verbose_name='业务范围内容')
    en_titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题英文')
    en_txt = models.TextField(blank=True, null=True,verbose_name='业务范围内容英文')
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='日期')
    images = models.ManyToManyField(File,verbose_name='业务范围图片')
