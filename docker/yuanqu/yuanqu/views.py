# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
# Create your views here.
#from django.contrib import auth
#from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
#from django.contrib.auth.decorators import login_required
#import time,traceback
#from rest_framework import viewsets,generics,filters
#from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.auth.models import User as DjangoUser
#import sys, urllib2, json
from Device.models  import *
from .settings import *
@csrf_exempt
# @login_required(login_url="/login/")
def index(request):
    # return render_to_response('index.html')
    return render(request, 'index.html',locals())



@csrf_exempt
def page_not_found(request):
    if request.path[-1]=='/':
        return render_to_response('error/error_404.html')
    else:
        return HttpResponseRedirect(request.path+'/')
 
@csrf_exempt
def page_error(request):
    if request.path[-1]=='/':
        return render_to_response('error/error_500.html')
    else:
        return HttpResponseRedirect(request.path+'/')

from wechatpy.utils import check_signature
from wechatpy.exceptions import InvalidSignatureException
from wechatpy import parse_message, create_reply
from wechatpy.replies import BaseReply
from wechatpy import WeChatClient
from wechatpy.oauth import WeChatOAuth
from django.contrib.auth.models import User
import datetime
# import wx.wechat as wx_wechat
import traceback
@csrf_exempt
def wx(request):
    try:
        if request.method == 'GET':
            signature = request.GET.get('signature', '')
            timestamp = request.GET.get('timestamp', '')
            nonce = request.GET.get('nonce', '')
            echo_str = request.GET.get('echostr', '')
            try:
                check_signature(Token, signature, timestamp, nonce)
            except InvalidSignatureException:
                echo_str = '错误的请求'
            response = HttpResponse(echo_str)

        if request.method == 'POST':
            
            msg = parse_message(request.body)
            msg_dict = msg.__dict__['_data']
            # print(msg.id, msg.source, msg.create_time, msg.type, msg.target, msg.time, msg.__dict__['_data']['Event'], '====')
            if msg.type == 'text':
                openid = msg.source
                user = User.objects.filter(username=openid).first()
                if not user:
                    user = User(username=openid)
                    user.set_password('111111')
                    user.save()
                # print msg_dict
                f = open("/app/weixin.txt", "a+") 
                # print >> f, '{}状态:\r\n'.format(d.name),json.dumps(data, sort_keys=True, indent=4, separators=(', ', ': '),ensure_ascii=False)
                print >> f,msg_dict
                print >> f,msg.source
                # print >> f,'openid:{}'.format(msg.sourc)
                f.close()
                if len(msg.content)==len('235063032cf432acb184'):
                    device = Device.objects.filter(tuya_code=msg.content)
                    if not device:
                        name = 'wifi插座{}'.format(str(datetime.datetime.now()))
                        Device.objects.create(tuya_code=msg.content,name=name,user=user,devicetype_id=24)
                    else:
                        device.update(user=user)

            elif msg.type == 'event':
                if msg_dict['Event'] == 'subscribe':
                    # 关注后 将获取的用户的信息保存到数据库
                    # wx_wechat.subscribe(getWxUserInfo(msg.source))
                    print 'openid',msg.sourc
                    print getWxUserInfo(msg.source)
                elif msg_dict['Event'] == 'unsubscribe':
                    # 取关后，将用户的关注状态更改为 未关注
                    # wx_wechat.unsubscribe(msg.source)
                    pass
            else:
                pass
            response = HttpResponse('', content_type="application/xml")
        return response
    except:
        traceback.print_exc()

def getWxClient():
    return WeChatClient(settings.AppID, settings.AppSecret)


def getWxUserInfo(openid):
    wxClient = getWxClient()
    wxUserInfo = wxClient.user.get(openid)
    return wxUserInfo

def getWeChatOAuth(redirect_url):
    return WeChatOAuth(settings.AppID, settings.AppSecret, redirect_url)

# 定义授权装饰器
def oauth(method):
    def warpper(request):
        if request.session.get('user_info', None) is None:
            code = request.GET.get('code', None)
            wechat_oauth = getWeChatOAuth(request.get_raw_uri())
            url = wechat_oauth.authorize_url
            if code:
                try:
                    wechat_oauth.fetch_access_token(code)
                    user_info = wechat_oauth.get_user_info()
                except Exception as e:
                    print(str(e))
                    # 这里需要处理请求里包含的 code 无效的情况
                    # abort(403)
                else:
                    request.session['user_info'] = user_info
            else:
                return redirect(url)

        return method(request)
    return warpper

@oauth
def get_wx_user_info(request):
    user_info = request.session.get('user_info')
    return HttpResponse(str(user_info))