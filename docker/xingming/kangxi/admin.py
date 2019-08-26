# -*- coding: utf-8 -*-
from django.contrib import admin
from models import *
import sys;
reload(sys);
sys.setdefaultencoding("utf8")
# Register your models here.


class HanziAdmin(admin.ModelAdmin):
    list_display = ('zi', 'bihua','wuxing')
    ordering=['bihua']
    model = Hanzi
        

admin.site.register(Hanzi, HanziAdmin)

class WugeAdmin(admin.ModelAdmin):
    list_display = ('number', 'txt','jx')
    ordering=['number']
    model = Wuge
        

admin.site.register(Wuge, WugeAdmin)