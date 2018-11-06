# -*- coding: utf-8 -*-
from django.contrib import admin
from models import *
import sys;
reload(sys);
sys.setdefaultencoding("utf8")
# Register your models here.

admin.site.site_header = '京航安后台管理'
admin.site.site_title = '京航安'
class NewsAdmin(admin.ModelAdmin):
    list_display = ('titile', 'author', 't')
    model = News
        
class FileAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'image','ws')
    readonly_fields = ('ws','thumb')
    model = File

class SLIDEAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'image','ws','file')
    readonly_fields = ('ws','thumb')
    model = SLIDE
admin.site.register(News, NewsAdmin)
admin.site.register(Scope, None)
admin.site.register(Leader, None)
admin.site.register(File, FileAdmin)
admin.site.register(Other, None)
admin.site.register(SLIDE, SLIDEAdmin)

