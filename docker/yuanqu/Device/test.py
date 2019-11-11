# -*- coding: utf-8 -*-
import datetime, time, httplib
import datetime
import hashlib
import base64
import hmac
import json

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
            'url': '/v1.0/devices/vdevo156741324322855/statistics/total?code=add_ele',
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
        # headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id']+ str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
        
        print headers
        data = self.get(url,{},headers)
        # print data
        data = json.loads(data)
        self.access_token = data['result']['access_token']
        return data
        # return headers['sign']

    def getEle(self):
        headers = self.urls['获取电量']['headers']
        headers['access_token'] = self.access_token
        # headers['t'] = int(time.mktime(datetime.datetime.now().timetuple()))*1000
        message = headers['client_id'] + self.access_token + str(headers['t'])
        self.get_hmac_sha256(message)
        headers['sign'] = self.signature
            
        url = self.urls['获取电量']['url']
        # print headers['sign']
        print headers
        data = self.get(url,{},headers)
        # print data
        data = json.loads(data)
        print data


h = HttpRest()
h.getToken()
h.getEle()