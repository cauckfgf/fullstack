# -*- coding: utf-8 -*-

import urllib,urllib2
import sys
import json

# reload(sys) 
# sys.setdefaultencoding('utf-8') 


class Tuling(object):
    def __init__(self):
        self.API_KEY = '05fed9a7d6bf4b708c92a29bcd23cf60'

    def v1(self,value):
        raw_TULINURL = "http://www.tuling123.com/openapi/api?key=%s&info=" % self.API_KEY
        TULINURL = "%s%s" % (raw_TULINURL,urllib2.quote(value.encode("utf-8")))
        req = urllib2.Request(url=TULINURL)
        result = urllib2.urlopen(req).read()
        hjson=json.loads(result)
        print u'图灵回复v1',hjson
        return hjson

    def v2(self,value):
        url = "http://openapi.tuling123.com/openapi/api/v2"
        d = {
            "reqType":0,
            "perception": {
                "inputText": {
                    "text": value
                },
            },
            "userInfo": {
                "apiKey": self.API_KEY,
                "userId": "179729"
            }
        }
        data = json.dumps(d)  
        #enable cookie 
        opener = urllib2.Request(url, data, {'Content-Type':'application/json'})
        response = urllib2.urlopen(opener)
        # opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())  
        # response = opener.open(url, data)
        result = response.read() 
        hjson=json.loads(result)
        print u'图灵回复v2',hjson
        return hjson

class DialogMachine(StateMachine):
    states = set(list(robotStr.objects.all().values_list("curState",flat=True)) + list(robotStr.objects.all().values_list("nextState",flat=True)))
    for i in states:
        if i:
            s = "%s = State('%s')"%(i,i)
            exec(s)
    start = State('start', initial=True)
    #发起维修单
    # space = State('space')#询问位置
    # device = State('device')#询问设备
    # submit = State('submit')#询问确认提交
    # html = State('html')
    # tuling = State('tuling')

    again = False
    # go_space = start.to(space)
    # go_device = space.to(device)
    # go_submit = device.to(submit)
    go_start = start.to(start)
    sim = Similar()
    tl = Tuling()
    #页面导航
    def __init__(self):
        super(DialogMachine, self).__init__()

    def to(self,m):
        self.sim.option(m,'status')
        most = self.sim.getmostsimllar()
        if most['t']>30:
            # 不同分支 tuling 导航 发起维修单
            self.current_state_value = most['nextState']
            self.again = False
            rdata = {'obj':most}

        else:
            #根据当前状态读取匹配
            rdata = self.do(m)
        return rdata

    def do(self,m):
        rdata = {}
        most = None
        if self.current_state==self.tuling:
            most = self.tl.v1(m)
        else:
            self.sim.option(m,self.current_state_value)
            most = self.sim.getmostsimllar()
            if most['t']>20:
                self.again = False
                self.current_state_value = most['nextState']
            else:
                self.again = True

        rdata['current_state']= self.current_state_value
        rdata['obj'] = most
        return rdata


