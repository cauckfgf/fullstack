# -*- coding: utf-8 -*-
import time,json
import urllib2
def post(URL,values):
    headers = {'Content-Type': 'application/json'}
    data = json.dumps(values)    #适用urllib对数据进行格式化编码
    req = urllib2.Request(url=URL, headers=headers, data=data)    #生成页面请求的完整数据
    response = urllib2.urlopen(req)     #发送页面请求
    return json.loads(response.read())    #获取服务器返回的页面信息

def get(URL):
    response = urllib2.urlopen(URL) #调用urllib2向服务器发送get请求
    return json.loads(response.read()) #获取服务器返回的页面信息

# scheduler.add_job('job3', test_data,trigger='cron',second='*/5',args=['z'])
# args = eval_r(jobargs['args'])
# trigger = jobargs['trigger']
# seconds = jobargs['seconds']
v = {
    'args':['http://yunwei:8000/device/timedtask/'],
    'trigger':'cron',
    'second':'00',
    'minute':'00',
    'hour':'8',
    'timezone':'Asia/Shanghai'
}
#print post('http://127.0.0.1:8000/job',v)
print get('http://127.0.0.1:8000/job')
