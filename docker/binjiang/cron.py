# -*- coding:utf-8 -*-
import os
import sys
import django
import json
import httplib
import datetime
import traceback
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
        '获取设备列表':{
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
        '告警事件类型列表':{
            'url': '/spm-api/rest/alarmType/getList',
            'params': {}
        },
        '告警阈值设置':{
            'url': '/spm-api/rest/alarmset/getAlarmSetList',
            'params': {}
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
            print datetime.datetime.now(), rest
            return data
        else:
            return None

    def getDeviceTypeCode(self):
        data = self.post(self.urls['获取设备类型列表']['url'],{})
        # print data
        data = json.loads(data)
        for each in data['result']:
            DeviceType.objects.get_or_create(id=each['id'], name=each['name'])

    def getDevicePage(self):
        for devicetype in DeviceType.objects.all():
            currPage = 1
            p = {'currPage': 1, 'pageSize': 80,'deviceTypeId':devicetype.id}
            totalPage = 0
            while currPage!=totalPage:
                data = self.post(self.urls['获取设备列表']['url'], p)
                # print data
                data = json.loads(data)
                totalPage = data['result']["totalPage"]
                currPage += 1
                p['currPage'] = currPage
                for each in data['result']["list"]:
                    areay = each.get('areay','')
                    areax = each.get('areax','')
                    structureName=each.get('structureName','')
                    try:
                        Device.objects.get_or_create(id=each['id'], name=each['name'], areay=areay, 
                                                     areax=areax, code=each['code'], structureName=structureName,
                                                     devicetype=devicetype)
                    except:
                        traceback.print_exc()
                        Device.objects.filter(id=each['id']).update(name=each['name'], areay=areay, 
                                                                     areax=areax, code=each['code'], structureName=structureName,
                                                                     devicetype=devicetype)
    def getAlarmType(self):
        data = self.post(self.urls['告警事件类型列表']['url'],{})
        # print data
        data = json.loads(data)
        for each in data['result']:
            if not AlarmType.objects.get(id=each['id']):
                AlarmType.objects.create(id=each['id'],name=each['name'],key=each['code'])

    def getAlarmType(self):
        try:
            data = self.post(self.urls['告警事件类型列表']['url'],{})
            # print data
            data = json.loads(data)
            for each in data['result']:
                if not AlarmType.objects.get(id=each['id']):
                    AlarmType.objects.create(id=each['id'],name=each['name'],key=each['code'])
        except:
            traceback.print_exc()

    def getAlarmSetList(self):
        try:
            for t in AlarmType.objects.all():
                #告警级别：1 提醒、2 注意、3 警告、4 危险、5 事故
                for level in range(3,6):
                    currPage = 1
                    p = {'currPage': 1, 'pageSize': 80,'eventType':str(t.id),'alarmLevel':string(level)}
                    totalPage = 0
                    while currPage!=totalPage:
                        data = self.post(self.urls['告警阈值设置']['url'], p)
                        print data
                        data = json.loads(data)
                        totalPage = data['result']["totalPage"]
                        currPage += 1
                        p['currPage'] = currPage
                        for each in data['result']["list"]:
                            state = each.get('state','')
                            ss = None
                            if state==1:
                                begin_value = str(each.get('begin_value',''))
                                end_value = str(each.get('end_value',''))
                                dev_type = each.get('dev_type')
                                ss = Sensor.objects.filter(device__devicetype_id=dev_type,key=t.key)
                            elif state==2:
                                begin_value = str(each.get('begin_value',''))
                                end_value = str(each.get('end_value',''))
                                dev_id = each.get('dev_id')
                                ss = Sensor.objects.filter(device_id=dev_id,key=t.key)
                            if ss:
                                if level==5:
                                    ss.update(range11=begin_value,range12=end_value)
                                elif level==4:
                                    ss.update(range21=begin_value,range22=end_value)
                                elif level==3:
                                    ss.update(range31=begin_value,range32=end_value)
      
                                p={
                                    'id' : each['id'],
                                    'create_time' : each['create_time'],
                                    'alarm_level' : each['alarm_level'],
                                    'sensor' : ss.first(),
                                    'abi_time' : each['abi_time'],
                                }
                                Alarm.objects.get_or_create(**p)
        except:
            traceback.print_exc()

test = HttpRest()
test.getDeviceTypeCode()
test.getDevicePage()
test.getAlarmType()
test.getAlarmSetList()