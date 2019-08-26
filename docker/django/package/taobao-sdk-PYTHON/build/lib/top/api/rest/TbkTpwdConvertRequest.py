'''
Created by auto_sdk on 2018.04.04
'''
from top.api.base import RestApi
class TbkTpwdConvertRequest(RestApi):
    def __init__(self,domain='gw.api.taobao.com',port=80):
        RestApi.__init__(self,domain, port)
        self.password_content = None
        self.adzone_id = None
        self.dx = None


    def getapiname(self):
        return 'taobao.tbk.tpwd.convert'
