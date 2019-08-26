# -*- coding: utf-8 -*-
# -*- coding: utf-8 -*-
import top.api
class tb(object):
    """淘宝"""
    def __init__(self):
        super(tb, self).__init__()
        top.setDefaultAppInfo("24842664", "7466d4ba4a21eaf2fd65bb2dae6b7a6b")
        self.
    def klzh(self):
        '''淘口令转链'''
        req=top.api.TbkTpwdConvertRequest('https://eco.taobao.com/router/rest',80)
        req.set_app_info(top.appinfo(appkey,secret))
         
        req.password_content="￥2k12308DjviP￥"
        req.adzone_id=12312312
        req.dx="1"
        try:
            resp= req.getResponse()
            print(resp)
        except Exception,e:
            print(e)