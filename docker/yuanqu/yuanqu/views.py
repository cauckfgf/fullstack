# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
# Create your views here.
#from django.contrib import auth
#from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib import auth
#from django.contrib.auth.decorators import login_required
#import time,traceback
#from rest_framework import viewsets,generics,filters
#from django_filters.rest_framework import DjangoFilterBackend
# from django.contrib.auth.models import User as DjangoUser
#import sys, urllib2, json
import json
from Device.models  import *
from django.contrib.auth.models import User,Group
import settings
from django.template import loader,Context,RequestContext
@csrf_exempt
# @login_required(login_url="/login/")
def index(request):
    # return render_to_response('index.html')
    openid = request.GET.get('openid')
    try:
        if openid:
            user = auth.authenticate(openid=openid)
            auth.login(request,user)
    except:
        pass
    return render_to_response('index.html',RequestContext(request, locals()))
    # return render(request, 'index.html',locals())
   

@csrf_exempt
# @login_required(login_url="/login/")
def home(request):
    openid = request.GET.get('openid')
    try:
        if openid:
            user = auth.authenticate(openid=openid)
            auth.login(request,user)
    except:
        pass
    return render_to_response('home/index.html',RequestContext(request, locals()))

@csrf_exempt
# @login_required(login_url="/login/")
def mobile(request):
    openid = request.GET.get('openid')
    try:
        if openid:
            user = auth.authenticate(openid=openid)
            auth.login(request,user)
    except:
        pass
    return render_to_response('mobile/index.html',RequestContext(request, locals()))

@csrf_protect
def login(request):
    username = request.POST.get('username')  
    password = request.POST.get('password')
    nextpage = request.POST.get('next',"/")
    user = auth.authenticate(username=username,password=password)
    if user and user.is_active:
        auth.login(request, user)
        return JsonResponse({'res':'succ'})
    else:
        return JsonResponse({'res':'error'})

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
# from wechatpy.replies import TextReply

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
            articles = [
                {
                    'title': 'wifi插座管理',
                    'description': 'wifi插座管理',
                    'image': 'https://mmbiz.qpic.cn/mmbiz_png/uvEWHtO4sbiaCUyibY9UyHqD1y5Fe5FEZavZ701bKTRRjLxDUXnNYeZT9Yf6DdwCbic70QWerRdfFKLWaR3QWiahjQ/0?wx_fmt=png',
                    'url': 'http://energy.shuhuhu.com/index/?openid={}#/nenghao'.format(msg.source)
                },
                # add more ...
            ]
            reply = create_reply(articles, msg)
            
            msg_dict = msg.__dict__['_data']
            # print(msg.id, msg.source, msg.create_time, msg.type, msg.target, msg.time, msg.__dict__['_data']['Event'], '====')
            if msg.type == 'text':
                openid = msg.source
                user = User.objects.filter(username=openid).first()
                if not user:
                    g = Group.objects.get_or_create(name='微信用户')[0]
                    user = User(username=openid)
                    user.set_password('111111')
                    user.save()
                    user.groups.add(g)
                # print msg_dict
                f = open("/app/weixin.txt", "a+") 
                # print >> f, '{}状态:\r\n'.format(d.name),json.dumps(data, sort_keys=True, indent=4, separators=(', ', ': '),ensure_ascii=False)
                print >> f,msg_dict
                print >> f,msg.source
                # print >> f,'openid:{}'.format(msg.sourc)
                f.close()
                if len(msg.content)==len('235063032cf432acb184') or len(msg.content)==len('6ceddf80f74f7cc073nufk'):
                    device = Device.objects.filter(tuya_code=msg.content)
                    if not device:
                        name = 'wifi插座{}'.format(str(datetime.datetime.now()))
                        
                        d = Device.objects.create(tuya_code=msg.content,name=name,user=user,devicetype_id=24)
                        h = HttpRest()
                        t = h.getToken()
                        s = h.getStatus_one(d)
                        reply = create_reply("{}已经添加".format(d.name), msg)
                    else:
                        device.update(user=user)
                        d = device.first()
                        lastdata = SensorData.objects.filter(sensor__device_id=d.id).last()
                        if lastdata:
                            reply = create_reply("名称: {}\r\n用电量: {}KWh\r\n时间: {}".format(d.name,lastdata.data,str(lastdata.stime)), msg)
                        # rep = "用电量:{}KWh\r\n时  间:{}".format(lastdata.data,str(lastdata.stime))
                devices = Device.objects.filter(name=msg.content)
                if devices:
                    devices.update(user=user)
                    d = devices.first()
                    lastdata = SensorData.objects.filter(sensor__device_id=d.id).last()
                    reply = create_reply("名称: {}\r\n用电量: {}KWh\r\n时间: {}".format(d.name,lastdata.data,str(lastdata.stime)), msg)
            elif msg.type == 'event':
                if msg_dict['Event'] == 'subscribe':
                    # 关注后 将获取的用户的信息保存到数据库
                    # wx_wechat.subscribe(getWxUserInfo(msg.source))
                    
                    print 'openid',msg.source
                    user = User.objects.filter(username=openid).first()
                    if not user:
                        g = Group.objects.get_or_create(name='微信用户')[0]
                        user = User(username=openid)
                        user.set_password('111111')
                        user.save()
                        user.groups.add(g)
                    # print getWxUserInfo(msg.source)
                    pass
                elif msg_dict['Event'] == 'unsubscribe':
                    # 取关后，将用户的关注状态更改为 未关注
                    # wx_wechat.unsubscribe(msg.source)
                    pass
            else:
                pass
            response = HttpResponse(reply.render(), content_type="application/xml")
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

@csrf_exempt
def ceshi(request):
    try:
        print  json.loads(request.body)
    except:
        traceback.print_exc()
    print 11111111111111111111
    return JsonResponse({})
