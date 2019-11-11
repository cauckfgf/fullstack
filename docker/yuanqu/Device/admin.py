# -*- coding: utf-8 -*-
from django.contrib import admin
from models import *
import sys;
reload(sys);
sys.setdefaultencoding("utf8")
# Register your models here.


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id','name', )
    # ordering=['t']
    model = Project
    
class SystemAdmin(admin.ModelAdmin):
    list_display = ('id','name', )
    # ordering=['t']
    model = System
        
class DeviceTypeAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'icon1', 'icon2','icon3')
    # readonly_fields = ('ws','thumb')
    model = DeviceType

class DeviceAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'devicetype', 'system')
    list_filter = ('system',)
    # readonly_fields = ('ws','thumb')
    model = Device

class Device2DeviceAdmin(admin.ModelAdmin):
    list_display = ('id','device_from', 'position_from', 'device_to', 'position_to', 'connection','system')
    list_filter = ('system',)
    model = Device2Device

class SensorAdmin(admin.ModelAdmin):
    list_display = ('name', 'lastdata')
    model = Sensor
    
class TimerTuYaAdmin(admin.ModelAdmin):
    list_display = ('describe', )
    model = TimerTuYa

admin.site.register(System, SystemAdmin)
admin.site.register(DeviceType, DeviceTypeAdmin)
admin.site.register(Device, DeviceAdmin)
admin.site.register(Device2Device, Device2DeviceAdmin)
admin.site.register(Sensor, SensorAdmin)
admin.site.register(TimerTuYa, TimerTuYaAdmin)
admin.site.register(Project, ProjectAdmin)
