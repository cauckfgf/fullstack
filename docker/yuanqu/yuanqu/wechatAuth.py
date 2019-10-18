# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend
import traceback
'''
    微信openid认证登录
'''
class WechatOpenidAuth(ModelBackend):

    def authenticate(self,openid=None):
        if openid:
            try:
                user = User.objects.filter(username=openid).first()
                return user
            except:
                traceback.print_exc()
                return None
        else:
            return None

