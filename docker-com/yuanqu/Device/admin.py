# -*- coding: utf-8 -*-
from django.contrib import admin
from models import *
import sys;
reload(sys);
sys.setdefaultencoding("utf8")
# Register your models here.

class SystemAdmin(admin.ModelAdmin):
    list_display = ('name', )
    # ordering=['t']
    model = System
        
class DeviceTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon1', 'icon2','icon3')
    # readonly_fields = ('ws','thumb')
    model = DeviceType

class DeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'devicetype', 'system')
    # readonly_fields = ('ws','thumb')
    model = Device

class Device2DeviceAdmin(admin.ModelAdmin):
    list_display = ('device_from', 'position_from', 'device_to', 'position_to', 'connection')
    model = Device2Device

class SensorAdmin(admin.ModelAdmin):
    list_display = ('name', 'lastdata')
    model = Sensor
    
admin.site.register(System, SystemAdmin)
admin.site.register(DeviceType, DeviceTypeAdmin)
admin.site.register(Device, DeviceAdmin)
admin.site.register(Device2Device, Device2DeviceAdmin)
admin.site.register(Sensor, SensorAdmin)
