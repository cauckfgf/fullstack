# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth.decorators import login_required
from .dialog import Tuling
import hashlib
import urllib
import sys
import json
# Create your views here.
@csrf_exempt
def wx(request):
    if request.method == 'GET':
        #下面这四个参数是在接入时，微信的服务器发送过来的参数
        signature = request.GET.get('signature', None)
        timestamp = request.GET.get('timestamp', None)
        nonce = request.GET.get('nonce', None)
        echostr = request.GET.get('echostr', None)

        #这里的token需要自己设定，主要是和微信的服务器完成验证使用
        token = 'fgf1987'

        #把token，timestamp, nonce放在一个序列中，并且按字符排序
        hashlist = [token, timestamp, nonce]
        hashlist.sort()

        #将上面的序列合成一个字符串
        hashstr = ''.join([s for s in hashlist])

        #通过python标准库中的sha1加密算法，处理上面的字符串，形成新的字符串。
        hashstr = hashlib.sha1(hashstr.encode(encoding='utf-8')).hexdigest()

        #把我们生成的字符串和微信服务器发送过来的字符串比较，
        #如果相同，就把服务器发过来的echostr字符串返回去
        if hashstr == signature:
          return HttpResponse(echostr)

    if request.method == 'POST':
        #将程序中字符输出到非 Unicode 环境（比如 HTTP 协议数据）时可以使用 smart_str 方法
        data = smart_str(request.body)
        #将接收到数据字符串转成xml
        xml = etree.fromstring(data)

        #从xml中读取我们需要的数据。注意这里使用了from接收的to，使用to接收了from，
        #这是因为一会我们还要用这些数据来返回消息，这样一会使用看起来更符合逻辑关系
        fromUser = xml.find('ToUserName').text
        toUser = xml.find('FromUserName').text
        msg_type = xml.find('MsgType').text
        Content = xml.find('Content').text
        #这里获取当前时间的秒数，time.time()取得的数字是浮点数，所以有了下面的操作
        nowtime = str(int(time.time()))
        tl = Tuling()
        # return HttpResponse()
        #加载text.xml模板,参见render()调用render_to_string()并将结果馈送到 HttpResponse适合从视图返回的快捷方式 。
        if msg_type == 'text':
            res = tl.v1(Content)
            # res2 = tl.v2(Content)
            
            if res['code']==100000:
                replyMsg = AllMsg(toUser, fromUser, res['text'])
                #print replyMsg.Txt()
                return HttpResponse(replyMsg.Txt())
            elif res['code']==200000:
                # replyMsg = AllMsg(toUser, fromUser, res['text'],picurl=res['url'])
                # print replyMsg.ImgTxt()
                # return HttpResponse(replyMsg.ImgTxt())
                txt = "%s<a href='%s'>打开页面</a>"%(res['text'],res['url'])
                replyMsg = AllMsg(toUser, fromUser, txt)
                print(replyMsg.Txt())
                return HttpResponse(replyMsg.Txt())

        elif msg_type == 'image':
            content = "图片已收到,谢谢"
            replyMsg = AllMsg(toUser, fromUser, content)
            return HttpResponse(replyMsg.Txt())
        elif msg_type == 'voice':
            content = "语音已收到,谢谢"
            replyMsg = AllMsg(toUser, fromUser, content)
            return HttpResponse(replyMsg.Txt())
        elif msg_type == 'video':
            content = "视频已收到,谢谢"
            replyMsg = AllMsg(toUser, fromUser, content)
            return HttpResponse(replyMsg.Txt())
        elif msg_type == 'shortvideo':
            content = "小视频已收到,谢谢"
            replyMsg = AllMsg(toUser, fromUser, content)
            return HttpResponse(replyMsg.Txt())
        elif msg_type == 'location':
            content = "位置已收到,谢谢"
            replyMsg = AllMsg(toUser, fromUser, content)
            return HttpResponse(replyMsg.Txt())
        else:
            msg_type == 'link'
            content = "链接已收到,谢谢"
            replyMsg = AllMsg(toUser, fromUser, content)
            return HttpResponse(replyMsg.Txt())

import time
class AllMsg(object):
    def __init__(self, toUserName, fromUserName, content,picurl='',url=''):
        self.__dict = dict()
        self.__dict['ToUserName'] = toUserName
        self.__dict['FromUserName'] = fromUserName
        self.__dict['CreateTime'] = int(time.time())
        self.__dict['Content'] = content
        self.__dict['picurl'] = picurl
        self.__dict['url'] = url

    def Txt(self):
        XmlForm = """
        <xml>
        <ToUserName><![CDATA[{ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[{FromUserName}]]></FromUserName>
        <CreateTime>{CreateTime}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[{Content}]]></Content>
        </xml>
        """
        return XmlForm.format(**self.__dict)

    def ImgTxt(self):
        XmlForm = """
        <xml>
        <ToUserName><![CDATA[{ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[{FromUserName}]]></FromUserName>
        <CreateTime>{CreateTime}</CreateTime>
        <MsgType><![CDATA[news]]></MsgType>
        <ArticleCount>1</ArticleCount>
        <Articles>
        <item>
        <Title><![CDATA[{Content}]]></Title> 
        <Description><![CDATA[]]></Description>
        <PicUrl><![CDATA[{picurl}]]></PicUrl>
        <Url><![CDATA[{picurl}]]></Url>
        </item>
        </Articles>
        </xml>
        """
        return XmlForm.format(**self.__dict)

@csrf_exempt
def ylg(request):
    #ylg = "http://pub.alimama.com/items/search.json?q=%E5%8E%8B%E5%8A%9B%E9%94%85%201%E4%BA%BA-2%E4%BA%BA%20%E5%B0%8F%E5%9E%8B&_t=1522672038051&auctionTag=&perPageSize=50&shopTag=yxjh&t=1522672038054&_tb_token_=7e3334733150e&pvid=10_180.157.88.117_13571_1522672028149"
    s = urllib.parse.quote('水杯')
    ylg = "http://pub.alimama.com/items/search.json?q=%s"%(s)
    #req = urllib2.Request(url=TULINURL)
    result = urllib.request.urlopen(ylg).read()
    hjson=json.loads(result)
    return JsonResponse(hjson)
