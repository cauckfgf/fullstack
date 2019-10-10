# -*- coding:utf-8 -*-
# 同时设备类型设备
import os
import sys
import django
import json

import traceback
from dateutil.relativedelta import relativedelta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "yuanqu.settings")
django.setup()

import datetime, time, httplib
import hashlib
import base64
import hmac
from Device.models import *
class HttpRest(object):

    urls = {
        '获取token':{
            'url': '/v1.0/token?grant_type=1',
            'params': {
                'parentId':'1'
            },
            'headers':{
                'client_id':'kptdvrpktjrkanxxw474',
                # 'sign':'eujuuttq7hsgcs57ak7qx79sgkkkwxgw',
                't': int(time.mktime(datetime.datetime.now().timetuple()))*1000,
                # 't':1568865734445,
                'sign_method':'HMAC-SHA256',
                "Content-type": "application/json"
            }
        },
        '获取电量':{
            'url': '/v1.0/devices/{}/statistics/total?code=add_ele',
            'params': {
                'parentId':'1'
            },
            'headers':{
                'client_id':'kptdvrpktjrkanxxw474',
                # 'sign':'eujuuttq7hsgcs57ak7qx79sgkkkwxgw',
                # 't': int(time.mktime(datetime.datetime.now().timetuple()))*1000,
                # 't':1568865734445,
                'sign_method':'HMAC-SHA256',
                "Content-type": "application/json"
            }
        },
        '获取插座实时状态':{
            'url': '/v1.0/devices/{}',
            'params': {
                'parentId':'1'
            },
            'headers':{
                'client_id':'kptdvrpktjrkanxxw474',
                # 'sign':'eujuuttq7hsgcs57ak7qx79sgkkkwxgw',
                # 't': int(time.mktime(datetime.datetime.now().timetuple()))*1000,
                # 't':1568865734445,
                'sign_method':'HMAC-SHA256',
                "Content-type": "application/json"
            }
        },

    }
    access_token = ''
    signature = ''
    def post(self, rest, v, headers={}):
        # rest = /spm-api/rest/structure/findStructureList
        # v = {'a':'a'}
        conn = httplib.HTTPSConnection("openapi.tuyacn.com")  # 微信接口链接
        # headers = {"Content-type": "application/json"}
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

    def get(self, rest, v, headers={}):
        # rest = /spm-api/rest/structure/findStructureList
        # v = {'a':'a'}
        conn = httplib.HTTPSConnection("openapi.tuyacn.com")  # 微信接口链接
        # headers = {"Content-type": "application/json"}
        params = v
        conn.request("GET", rest, json.JSONEncoder().encode(params), headers)
        response = conn.getresponse()
        data = response.read()  # 推送返回数据
        conn.close()
        if response.status == 200:
            print datetime.datetime.now(), rest
            return data
        else:
            return None
    def get_hmac_sha256(self,message, secret='eujuuttq7hsgcs57ak7qx79sgkkkwxgw'):
        # if self.signature:
        #     return self.signature
        message = message.encode('utf-8')
        secret = secret.encode('utf-8')
        # signature = hmac.new(secret, message, digestmod=hashlib.sha256).digest()
        signature = hmac.new(secret, message, digestmod=hashlib.sha256)
        self.signature = signature.hexdigest().upper()
        # return self.signature

    def getToken(self):
        url = self.urls['获取token']['url']
        headers = self.urls['获取token']['headers']
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id']+ str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        
        # print headers['sign']
        data = self.get(url,{},headers)
        # print data
        data = json.loads(data)
        self.access_token = data['result']['access_token']
        return data
        # return headers['sign']

    def getEle(self):
        try:
            headers = self.urls['获取电量']['headers']
            headers['access_token'] = self.access_token
            headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
            message = headers['client_id'] + self.access_token + str(headers['t'])
            self.get_hmac_sha256(message)
            headers['sign'] = self.signature
            qs = []
            for d in Device.objects.filter(devicetype_id=24):
                lastdata = {} if not d.lastdata else json.loads(d.lastdata)
                url = self.urls['获取电量']['url'].format(d.tuya_code)
                # print headers['sign']
                print headers
                data = self.get(url,{},headers)
                # print data
                data = json.loads(data)
                ss = Sensor.objects.filter(device=d,name='用电量')
                s = None
                if ss:
                    s = ss.first()
                else:
                    s = Sensor.objects.create(device=d,name='用电量',unit='W')
                f = open("/app/info.txt", "a+") 
                print >> f, '{}电量:\r\n'.format(d.name),json.dumps(data, sort_keys=True, indent=4, separators=(', ', ': '),ensure_ascii=False)
                f.close()
                if data.get('success'):
                    lastdata[s.name] = data['result']['total']
                    d.lastdata = json.dumps(lastdata)
                    d.save()
                    s.lastdata = data['result']['total']
                    s.save()
                    qs.append(SensorData(sensor=s,data=data['result']['total']))
            SensorData.objects.bulk_create(qs)

        except:
            # traceback.print_exc()
            traceback.print_exc(file=open('/app/error.txt','a+'))
            # self.getToken()
            # self.getEle()

    def getStatus(self):
        m = {
            'cur_current':u'电流',
            'cur_voltage':u'电压',
            'cur_power':u'功率',
            'switch_1':u'开关状态',
            'countdown_1':u'倒计时',
        }
        try:
            headers = self.urls['获取插座实时状态']['headers']
            headers['access_token'] = self.access_token
            headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
            message = headers['client_id'] + self.access_token + str(headers['t'])
            self.get_hmac_sha256(message)
            headers['sign'] = self.signature
            qs = []
            for d in Device.objects.filter(devicetype_id=24):
                lastdata = {} if not d.lastdata else json.loads(d.lastdata)
                url = self.urls['获取插座实时状态']['url'].format(d.tuya_code)
                # print headers['sign']
                print headers
                data = self.get(url,{},headers)
                # print data
                data = json.loads(data)
                
                f = open("/app/info.txt", "a+") 
                print >> f, '{}状态:\r\n'.format(d.name),json.dumps(data, sort_keys=True, indent=4, separators=(', ', ': '),ensure_ascii=False)
                f.close()
                if data.get('success'):
                    d.name = data['result']['name']
                    for point in data['result']['status']:
                        lastdata[m.get(point['code'])] = point['value']
                    d.lastdata = json.dumps(lastdata)
                    d.save()
        except:
            # traceback.print_exc()
            traceback.print_exc(file=open('/app/error.txt','a+'))
            # self.getToken()
            # self.getEle()

h = HttpRest()
t = h.getToken()
# e = h.getEle()
s = h.getStatus()