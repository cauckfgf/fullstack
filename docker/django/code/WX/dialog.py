# -*- coding: utf-8 -*-

import urllib
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
        #req = urllib2.Request(url=TULINURL)
        result = urllib.request.urlopen(TULINURL).read()
        hjson=json.loads(result)
        print( u'图灵回复v1',hjson)
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
        print( u'图灵回复v2',hjson)
        return hjson




