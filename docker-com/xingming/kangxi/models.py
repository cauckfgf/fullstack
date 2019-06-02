# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
# @python_2_unicode_compatible
class Hanzi(models.Model):
    # 康熙词典字
    T_CHOICES = (
        (1, '金'),
        (2, '木'),
        (3, '水'),
        (4, '火'),
        (5, '土'),
    )
    zi = models.CharField(max_length=1, blank=True, null=True,verbose_name='字')
    bihua = models.IntegerField(default=0,verbose_name='康熙笔画')
    wuxing = models.IntegerField(verbose_name='五行属性',default=1,choices=T_CHOICES)
    def __unicode__(self):
        return self.titile
    class Meta: 
        verbose_name = '康熙词典' 
        verbose_name_plural = '康熙词典'


class Wuge(models.Model):
    """五格对应"""
    CHOICES = (
        (1, '大吉'),
        (2, '吉'),
        (3, '凶'),
        (4, '大凶'),
    )
    number = models.IntegerField(default=0,verbose_name='格数')
    txt = models.TextField(blank=True, null=True,verbose_name='对应含义')
    jx = models.TextField(max_length=12,verbose_name='吉凶',default="吉")
    jx_index = models.IntegerField(default=0,verbose_name='吉凶数',choices=CHOICES)

    @classmethod
    def name2wuge(clc,name):
        x = Hanzi.objects.get(zi=name[0])
        tiange = x.bihua+1
        ming1 = Hanzi.objects.get(zi=name[1])
        ming2 = Hanzi.objects.get(zi=name[2])
        renge = x.bihua + ming1.bihua
        dige = ming1.bihua + ming2.bihua
        waige = ming2.bihua + 1
        zongge = x.bihua + ming1.bihua + ming2.bihua
        return {
            "天":tiange,
            "地":dige,
            "人":renge,
            "外":waige,
            "总":zongge,
        }
    @classmethod
    def isbest(clc,x,y,z,best,best1):

        tian = x + 1
        di = y + z
        ren = x + y
        wai = z + 1
        zong = (x + y + z)%82
        if di in best1 and ren in best and wai in best and zong in best1:
            return {
                't':tian,
                'd':di,
                'r':ren,
                'w':wai,
                'z':zong
            }
        else:
            return {}
    @classmethod
    def xing2good(clc,s,index=1):
        data = []
        xing = Hanzi.objects.get(zi=s)
        best = list(Wuge.objects.filter(jx_index=1).values_list('number',flat=True))
        best1 = list(Wuge.objects.filter(jx_index__lte=index).values_list('number',flat=True))
        for x in xrange(1,31):
            for y in xrange(1,31):
                i = Wuge.isbest(xing.bihua,x,y,best,best1)
                if i:
                    data.append({
                        "f":x,
                        "s":y,
                        "i":i,
                        "fkey":'',
                        "skey":''
                    })
        return {
            "姓":s,
            "天格":xing.bihua+1,
            "天格解释":Wuge.objects.get(number=xing.bihua+1).txt,
            "大吉组合":data
        }



    class Meta: 
        verbose_name = '五格' 
        verbose_name_plural = '五格'
        