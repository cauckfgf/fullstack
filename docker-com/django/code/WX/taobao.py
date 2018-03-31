# -*- coding: utf-8 -*-
import top.api
class tb(object):
    """淘宝"""
    def __init__(self, arg):
        super(top, self).__init__()
        self.arg = arg

    def klzh(self):
        '''淘口令转链'''
        req=top.api.TbkTpwdConvertRequest(url,port)
        req.set_app_info(top.appinfo(appkey,secret))
         
        req.password_content="￥2k12308DjviP￥"
        req.adzone_id=12312312
        req.dx="1"
        try:
            resp= req.getResponse()
            print(resp)
        except Exception,e:
            print(e)