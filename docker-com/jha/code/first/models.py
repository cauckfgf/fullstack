# -*- coding: utf-8 -*-
from __future__ import absolute_import
from django.db import models
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
import os
from PIL import Image
from any.settings import MEDIA_ROOT
from django.db.models.fields.files import ImageFieldFile
from django.utils.html import format_html
# from django.utils.encoding import python_2_unicode_compatible
# Create your models here.
THUMB_ROOT = 'upload/thumb'
def make_thumb(path, size = 240):
    pixbuf = Image.open(path)
    width, height = pixbuf.size

    if width > size:
        delta = width / size
        height = int(height / delta)
        pixbuf.thumbnail((size, height), Image.ANTIALIAS)
        return pixbuf

class File(models.Model):
    title = models.CharField(max_length=120, blank=True, null=True,verbose_name='素材标题')
    image = models.ImageField(upload_to='upload/', verbose_name='素材图片')
    thumb = models.ImageField(upload_to = THUMB_ROOT, blank=True, null=True,verbose_name='素材微缩图')
    date = models.DateTimeField(auto_now_add=True)

    def ws(self):
        return format_html('<img src="{}" />'.format(self.thumb.url))
    ws.allow_tags = True
    ws.short_description = '微缩图'

    def save(self):
        super(File, self).save() #将上传的图片先保存一下，否则报错
        base, ext = os.path.splitext(os.path.basename(self.image.path))
        thumb_pixbuf = make_thumb(os.path.join(MEDIA_ROOT, self.image.name))
        relate_thumb_path = os.path.join(THUMB_ROOT, base + '.thumb' + ext).replace("\\","/")
        thumb_path = os.path.join(MEDIA_ROOT, relate_thumb_path).replace("\\","/")
        thumb_pixbuf.save(thumb_path)
        self.thumb = ImageFieldFile(self, self.thumb, relate_thumb_path)
        super(File, self).save() #再保存一下，包括缩略图等

    def __unicode__(self):
        return self.title if self.title else '素材'
    class Meta: 
        verbose_name = '素材' 
        verbose_name_plural = '素材'

# @python_2_unicode_compatible
class News(models.Model):
    # 实时新闻资讯
    T_CHOICES = (
        (1, '行业资讯'),
        (2, '公司新闻'),
    )
    titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='新闻标题')
    txt = RichTextUploadingField(verbose_name='新闻内容', blank=True, null=True)
    en_titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='新闻标题英文')
    en_txt = RichTextUploadingField(verbose_name='新闻内容英文', blank=True, null=True)
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='日期')
    image = models.ImageField(upload_to='upload/', verbose_name='新闻图片')
    author = models.CharField(max_length=200, blank=True, null=True,verbose_name='作者')
    pageviews = models.IntegerField(default=0,verbose_name='浏览量')
    shorttxt = models.IntegerField(default=0,verbose_name='新闻简介')
    t = models.IntegerField(verbose_name='企业新闻/公司新闻',default=1,choices=T_CHOICES)
    def __unicode__(self):
        return self.titile
    class Meta: 
        verbose_name = '实时新闻资讯' 
        verbose_name_plural = '实时新闻资讯'

class Scope(models.Model):
    # 业务范围
    titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题')
    txt = RichTextUploadingField(verbose_name='业务范围内容', blank=True, null=True)
    en_titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题英文')
    en_txt = RichTextUploadingField(verbose_name='业务范围内容英文', blank=True, null=True)
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='日期')
    images = models.ManyToManyField(File,verbose_name='业务范围图片', blank=True, null=True)
    def __unicode__(self):
        return self.titile
    class Meta: 
        verbose_name = '业务范围' 
        verbose_name_plural = '业务范围'

class Leader(models.Model):
    # 领导致辞
    name = models.CharField(max_length=200, blank=True, null=True,verbose_name='名字')
    position = models.CharField(max_length=200, blank=True, null=True,verbose_name='职位')
    txt = models.TextField(blank=True, null=True,verbose_name='内容')
    en_name = models.CharField(max_length=200, blank=True, null=True,verbose_name='名字')
    en_position = models.CharField(max_length=200, blank=True, null=True,verbose_name='职位')
    en_txt = models.TextField(blank=True, null=True,verbose_name='职位')
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='内容')
    images = models.ManyToManyField(File,verbose_name='图片')
    class Meta: 
        verbose_name = '领导致辞' 
        verbose_name_plural = '领导致辞'


class SLIDE(models.Model):
    title = models.CharField(max_length=120, blank=True, null=True,verbose_name='素材标题')
    image = models.ImageField(upload_to='upload/', verbose_name='轮播图片')
    file = models.FileField(upload_to='upload/', verbose_name='录播视频', blank=True, null=True)
    thumb = models.ImageField(upload_to = THUMB_ROOT, blank=True, null=True,verbose_name='素材微缩图')
    date = models.DateTimeField(auto_now_add=True)

    def ws(self):
        if self.thumb:
            return format_html('<img src="{}" />'.format(self.thumb.url))
        else:
            return format_html('视频暂不支持微缩图')
    ws.allow_tags = True
    ws.short_description = '首页轮播图'

    def save(self):
        super(SLIDE, self).save() #将上传的图片先保存一下，否则报错
        if self.image:
            base, ext = os.path.splitext(os.path.basename(self.image.path))
            thumb_pixbuf = make_thumb(os.path.join(MEDIA_ROOT, self.image.name))
            relate_thumb_path = os.path.join(THUMB_ROOT, base + '.thumb' + ext).replace("\\","/")
            thumb_path = os.path.join(MEDIA_ROOT, relate_thumb_path).replace("\\","/")
            thumb_pixbuf.save(thumb_path)
            self.thumb = ImageFieldFile(self, self.thumb, relate_thumb_path)
            super(SLIDE, self).save() #再保存一下，包括缩略图等
    class Meta: 
        verbose_name = '首页轮播图' 
        verbose_name_plural = '首页轮播图'

class Other(models.Model):
    # 其他 
    titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题')
    txt = models.TextField(blank=True, null=True,verbose_name='业务范围内容')
    en_titile = models.CharField(max_length=200, blank=True, null=True,verbose_name='业务范围标题英文')
    en_txt = models.TextField(blank=True, null=True,verbose_name='业务范围内容英文')
    ntime = models.DateTimeField(blank=True, null=True,verbose_name='日期')
    images = models.ManyToManyField(File,verbose_name='公司简介图片')
    class Meta: 
        verbose_name = '其他' 
        verbose_name_plural = '其他'