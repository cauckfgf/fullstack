# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
import json
from dateutil.relativedelta import relativedelta
# Create your models here.

class Project(models.Model):
    '''项目'''
    name = models.CharField(max_length=96,default='项目',verbose_name='名字')
    position = models.CharField(max_length=96,default='[]',verbose_name='经纬度')
    create_time = models.DateTimeField(auto_now_add=True)
    def __unicode__(self):
        return self.name

    def value(self):
        return eval(self.position)

    class Meta:
        verbose_name = '项目'
        verbose_name_plural = '项目'
        db_table = 'Device_Project'

class SystemType(models.Model):
    '''系统类型'''
    name = models.CharField(max_length=96,default='系统类型名字',verbose_name='名字')
    create_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = '系统类型'
        verbose_name_plural = '系统类型'
        db_table = 'Device_SystemType'

class System(models.Model):
    '''系统'''
    name = models.CharField(max_length=96,default='系统名字',verbose_name='名字')
    system_type = models.ForeignKey(SystemType,verbose_name='系统类型名字', null=True, blank=True)
    project = models.ForeignKey(Project,verbose_name='所属项目', null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    # devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = '系统'
        verbose_name_plural = '系统'
        db_table = 'Device_System'



class DeviceType(models.Model):
    '''设备类型'''
    name = models.CharField(max_length=96,default='未命名设备类型',verbose_name='类型名称')
    icon1 = models.FileField(upload_to='upload/', null=True, blank=True,verbose_name='设备拓扑图状态1图标')
    icon2 = models.FileField(upload_to='upload/',null=True, blank=True,verbose_name='设备拓扑图状态2图标')
    icon3 = models.FileField(upload_to='upload/',null=True, blank=True,verbose_name='设备拓扑图状态3图标')
    gif = models.FileField(upload_to='upload/',null=True, blank=True,verbose_name='设备动态图')
    def __unicode__(self):
        return self.name
    class Meta:
        verbose_name = '设备类型'
        verbose_name_plural = '设备类型'
        db_table = 'Device_DeviceType'

class Device(models.Model):
    '''设备'''
    CHOICES = (
        ('top','top'),
        ('left','left'),
        ('right','right'),
        ('bottom','bottom'),
        ('inside','inside'),
        ('insideLeft','insideLeft'),
        ('insideRight','insideRight'),
        ('insideTop','insideTop'),
        ('insideBottom','insideBottom'),
        ('insideTopLeft','insideTopLeft'),
        ('insideBottomLeft','insideBottomLeft'),
        ('insideTopRight','insideTopRight'),
        ('insideBottomRight','insideBottomRight'),
    )
    name = models.CharField(max_length=96,default='未命名设备',verbose_name='名字')
    status = models.IntegerField(default=1,verbose_name='状态')#1正常 2报警 或者开关关闭
    devicetype = models.ForeignKey(DeviceType,blank=True,null=True,related_name="Device",verbose_name='设备类型')
    system = models.ForeignKey(System,blank=True,null=True,verbose_name='设备所属系统')
    isrun = models.BooleanField(default=False,verbose_name='是否显示动态图')
    size = models.CharField(max_length=96,default='200,100',verbose_name='大小')
    label_position = models.CharField(max_length=96,default='bottom',verbose_name='设备文字位置',choices=CHOICES)
    tuya_code = models.CharField(max_length=96,default='',verbose_name='涂鸦设备code',blank=True)
    user = models.ForeignKey(User,verbose_name='设备负责人',blank=True,null=True,related_name='device2User',on_delete=models.SET_NULL)
    users = models.ManyToManyField(User,verbose_name='收藏设备的人',related_name='device2Users')
    lastdata = models.TextField(blank=True,null=True,verbose_name='最新数据json')
    def __unicode__(self):
        return self.name

    def sensors(self):
        return Sensor.objects.filter(device=self).order_by('-status').values('name','lastdata','unit','status','id')

    def showname(self):
        if "虚拟设备" in self.name:
            s = ''
            for i in Sensor.objects.filter(device=self):
                s += i.name+i.lastdata+i.unit+'\r\n'
            return s

        else:
            return self.name

    class Meta:
        verbose_name = '设备'
        verbose_name_plural = '设备'
        db_table = 'Device_Device'

class Device2Device(models.Model):
    '''设备连接'''
    CHOICES = (
        ('solid','实线'),
        ('dashed','长虚线'),
        ('dotted','短虚线'),
    )
    device_from = models.ForeignKey(Device,related_name="DeviceFrom",verbose_name='连接设备')
    position_from = models.CharField(max_length=96,default='1,2',verbose_name='连接设备在逻辑图中位置')
    device_to = models.ForeignKey(Device,related_name="DeviceTo",verbose_name='被连接设备')
    position_to = models.CharField(max_length=96,default='1,2',verbose_name='被连接设备在逻辑图中位置')
    connection = models.CharField(max_length=96,default='green',verbose_name='线颜色')
    system = models.ForeignKey(System,blank=True,null=True,verbose_name='设备所属系统')
    sensor = models.ForeignKey('Sensor',null=True,blank=True,verbose_name='连接传感器', on_delete=models.SET_NULL)
    mid = models.TextField(default='',blank=True,null=True,verbose_name='线路中间点位')
    show_direction = models.BooleanField(default=True,verbose_name='是否流向')
    line_style_type = models.CharField(max_length=96,default='solid',verbose_name='线的类型',choices=CHOICES)
    def path_list(self):
        def toInt(i):
            return int(float(i))
        if self.mid:
            return [map(toInt,self.position_from.split(','))] + json.loads(self.mid) + [map(toInt,self.position_to.split(','))]
        else:
            return [map(toInt,self.position_from.split(',')), map(toInt,self.position_to.split(','))]
    def __unicode__(self):
        return self.device_from.name+'-'+self.device_to.name

    def line(self):
        if self.sensor:
            return {
                'label':self.sensor.__unicode__(),
                'sensor_status': 'green' if self.sensor.status==1 else 'red'
            }
        else:
            return {
                'label':'',
                'sensor_status': self.connection
            }
    class Meta:
        verbose_name = '设备连接'
        verbose_name_plural = '设备连接'
        db_table = 'Device2Device'

class Sensor(models.Model):
    CHOICES = (
        ('opc', 'opc'),
        ('snmp', 'snmp'),
        ('modbus', 'modbus'),
    )
    name = models.CharField(max_length=96,default='点位名字',verbose_name='点位名字')
    lastdata = models.CharField(max_length=96,default='最新数值',verbose_name='最新数值',null=True,blank=True)
    device = models.ForeignKey('Device',null=True,verbose_name='设备',related_name='Sensor')
    unit = models.CharField(max_length=96,null=True,blank=True,default='℃',verbose_name='点位单位')
    isnumber = models.BooleanField(default=True,verbose_name='是否是数值量')
    status = models.IntegerField(default=1,verbose_name='状态') #1正常 2报警
    isrun = models.BooleanField(default=False,verbose_name='是否是决定设备运行停止进而影响逻辑图中是否显示动态图')
    # 数据对接部分
    xieyi = models.CharField(max_length=96, blank=True,null=True,verbose_name='code',choices=CHOICES)
    ip = models.CharField(max_length=15, blank=True,null=True,verbose_name='采集IP地址')
    port = models.IntegerField(default=0,blank=True,null=True)
    address = models.TextField(blank=True,null=True,verbose_name='opc 协议ItemName snmp oid modbus 寄存器地址')
    re_number = models.IntegerField(default=0,blank=True,null=True,verbose_name='寄存器数量')
    datatype = models.TextField(blank=True,null=True,verbose_name='解析方式json')
    modbus_device_id = models.IntegerField(default=0,blank=True,null=True)

    def __unicode__(self):
        return "{}:{}".format(self.name,self.lastdata)


    class Meta:
        verbose_name = '传感器'
        verbose_name_plural = '传感器'
        db_table = 'Device_Sensor'

class SensorData(models.Model):
    """传感器监测数据"""
    sensor = models.ForeignKey(Sensor)
    data = models.CharField(max_length=96, blank=True, null=True, verbose_name='传感器数据')
    stime = models.DateTimeField(verbose_name='记录时间',auto_now_add=True)
    mark = models.CharField(max_length=96, blank=True, null=True, verbose_name='标记')

    class Meta:
        db_table = 'Device_SensorData'

class TimerTuYa(models.Model):
    """涂鸦插座定时"""
    describe = models.TextField(verbose_name='任务描述')
    data = models.TextField(verbose_name='定时内容')

    class Meta:
        verbose_name = '插座定时策略'
        verbose_name_plural = '插座定时策略'
        db_table = 'Device_Timer'

import datetime, time, httplib
import hashlib
import base64
import hmac
import traceback
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
        '设备指令下发':{
            'url': '/v1.0/devices/{}/commands',
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
        '查询设备定时任务':{
            'url': '/v1.0/devices/{}/timers',
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
        '下发定时任务':{
            'url': '/v1.0/devices/{}/timers',
            'headers':{
                'client_id':'kptdvrpktjrkanxxw474',
                # 'sign':'eujuuttq7hsgcs57ak7qx79sgkkkwxgw',
                # 't': int(time.mktime(datetime.datetime.now().timetuple()))*1000,
                # 't':1568865734445,
                'sign_method':'HMAC-SHA256',
                "Content-type": "application/json"
            }
        },
        '删除设备下的所有定时任务':{
            'url': '/v1.0/devices/{}/timers',
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
    def __new__(cls, *args, **kwargs):
        if not hasattr(HttpRest,'_instance'):
            HttpRest._instance = object.__new__(cls)
        return HttpRest._instance
        
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
    def delete(self, rest, headers={}):
        # rest = /spm-api/rest/structure/findStructureList
        # v = {'a':'a'}
        conn = httplib.HTTPSConnection("openapi.tuyacn.com")  # 微信接口链接
        # headers = {"Content-type": "application/json"}
        conn.request("DELETE", rest, json.JSONEncoder().encode({}), headers)
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
                    d.lastdata = json.dumps(lastdata,ensure_ascii=False)
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

    def switch_on(self,code):
        headers = self.urls['设备指令下发']['headers']
        headers['access_token'] = self.access_token
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        url = self.urls['设备指令下发']['url'].format(code)
        params = {
            "commands":[
                {
                    "code": "switch_1",
                    "value":True
                }
            ]
        }
        print self.post(url,params,headers)
    def switch_off(self,code):
        headers = self.urls['设备指令下发']['headers']
        headers['access_token'] = self.access_token
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        url = self.urls['设备指令下发']['url'].format(code)
        params = {
            "commands":[
                {
                    "code": "switch_1",
                    "value":False
                }
            ]
        }
        print self.post(url,params,headers)
    def getTimer(self,code):
        # end_time = (t + relativedelta(seconds=4)).strftime("%H:%M")
        headers = self.urls['查询设备定时任务']['headers']
        headers['access_token'] = self.access_token
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        url = self.urls['查询设备定时任务']['url'].format(code)
        data = self.get(url,{},headers)
        return json.loads(data)

    def delTimer(self,code):
        headers = self.urls['删除设备下的所有定时任务']['headers']
        headers['access_token'] = self.access_token
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        url = self.urls['删除设备下的所有定时任务']['url'].format(code)
        data = self.delete(url,headers)
        return json.loads(data)

    def setTimer(self,code,t,value,week_day):
        
        # time = "19:22"
        # t=datetime.datetime.strptime(t,"%H:%M")
        # end_time = (t + relativedelta(seconds=4)).strftime("%H:%M")
        headers = self.urls['下发定时任务']['headers']
        headers['access_token'] = self.access_token
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        url = self.urls['下发定时任务']['url'].format(code)
        params = {   
            "category":"device{}".format(code),
            "loops":week_day,
            "time_zone":"+08:00",
            "timezone_id":"Asia/shanghai",
            "instruct":[
                {
                    "time":t,
                    "functions":[
                        {
                            "code":"switch_1",
                            "value":value
                        }
                    ]
                }
            ]
        }
        print self.post(url,params,headers)

    def getStatus_one(self,d):
        m = {
            'cur_current':u'电流',
            'cur_voltage':u'电压',
            'cur_power':u'功率',
            'switch_1':u'开关状态',
            'countdown_1':u'倒计时',
        }
        headers = self.urls['获取插座实时状态']['headers']
        headers['access_token'] = self.access_token
        headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        lastdata = {} if not d.lastdata else json.loads(d.lastdata)
        url = self.urls['获取插座实时状态']['url'].format(d.tuya_code)
        # print headers['sign']
        print headers
        data = self.get(url,{},headers)
        # print data
        data = json.loads(data)
        if data.get('success'):
            d.name = data['result']['name']
            lastdata['在线'] = '是' if data['result']['online'] else '否'
            for point in data['result']['status']:
                lastdata[m.get(point['code'])] = point['value']
            d.lastdata = json.dumps(lastdata,ensure_ascii=False)
            d.save()
        return d 
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
                    lastdata['在线'] = '是' if data['result']['online'] else '否'
                    for point in data['result']['status']:
                        lastdata[m.get(point['code'])] = point['value']
                    d.lastdata = json.dumps(lastdata,ensure_ascii=False)
                    d.save()
        except:
            # traceback.print_exc()
            traceback.print_exc(file=open('/app/error.txt','a+'))
            # self.getToken()
            # self.getEle()