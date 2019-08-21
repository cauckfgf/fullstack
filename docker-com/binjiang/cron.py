# -*- coding:utf-8 -*-
import os
import sys
import django
import json
import httplib

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "binjiang.settings")
django.setup()
from Device.models  import *
class HttpRest(object):

    urls = {
        '获取点位列表':{
            'url': '/spm-api/rest/structure/findStructureList',
            'params': {
                'parentId':'1'
            }
        },
        '获取点位下的设备':{
            'url': '/spm-api/rest/device/getPagingListAndStructure',
            'params': {
                'structureId':'8'
            }
        },
        '获取设备类型列表':{
            'url': '/spm-api/rest/deviceType/getDeviceTypeCode',
            'params': {}
        },
        '获取设备型号':{
            'url': '/spm-api/rest/deviceType/getDeviceModelCode',
            'params': {
                'deviceTypeId':'3'
            }
        },
        '获取设备型号':{
            'url': '/spm-api/rest/device/getDevicePage',
            'params': {
                'currPage': 1, 
                'pageSize': 10,
                "deviceTypeId":"1",
                "deviceModelId":"6"
            }
        },
        '获取海康监控视频流播放地址':{
            'url': '/spm-api/rest/deviceinfo/getdeviceLiubyId',
            'params': {
                'id': 1, 
            }
        },
        '获取区域当前客流量信息':{
            'url': '/spm-api/rest/structure/findStructurePeopleNum',
            'params': {
                'id': 12, 
            }
        },
        '获取智能电表、水位、温湿度传感器设备最新数据':{
            'url': '/spm-api/rest/device/getLastDeviceData',
            'params': {
                'code': 12, 
            }
        },
        '获取智能电表、水位、温湿度传感器设备历史数据':{
            'url': '/spm-api/rest/device/getDeviceDataListPage',
            'params': {
                'code': 12,
                'startTime': 1565391306, 
                'endTime': 1565391306, 
                'currPage': 1, 
                'pageSize': 10, 
            }
        },

    }

    def post(self, rest, v):
        # rest = /spm-api/rest/structure/findStructureList
        # v = {'a':'a'}
        conn = httplib.HTTPConnection("140.207.38.66:10018")  # 微信接口链接
        headers = {"Content-type": "application/json"}
        params = v
        conn.request("POST", rest, json.JSONEncoder().encode(params), headers)
        response = conn.getresponse()
        data = response.read()  # 推送返回数据
        conn.close()
        if response.status == 200:
            print 'success'
            return data
        else:
            return None

    def getDeviceTypeCode(self):
        data = self.post(self.urls['获取设备类型列表']['url'],{})
        print data
        data = json.loads(data)
        for each in data['result']:
            DeviceType.objects.get_or_create(id=each['id'], name=each['name'])
    def getDeviceTypeCode(self):
test = HttpRest()
test.getDeviceTypeCode()