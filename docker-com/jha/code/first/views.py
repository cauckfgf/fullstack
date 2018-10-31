# -*- coding: utf-8 -*-
import os
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from .models import *
import traceback
import random
from any.settings import MENUS
import copy
from rest_framework import viewsets,generics,filters,pagination
from django_filters.rest_framework import DjangoFilterBackend
import rest_framework_filters
from .serializers import *

class FileSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)


@csrf_exempt
# @login_required(login_url="/login/")
def index(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[0]['active'] = True
    slides = SLIDE.objects.all().order_by('-id')
    gongsi = [
        {
            'title':"致敬改革开放40年，展望光明未来30年：企业家如何顺势而起？",
            'c':"2018年是改革开放40周年，也是十九大“一张蓝图绘到底”、实现民族复兴的开局之年。回首过去风雨兼程的40年，展望未来波澜壮阔的30年，身处历史关键节点，身临国内外盘根错节的经济形势和市场状况，企业家如何才能坚定信心、读懂时代并看清未来？面临高管团队激情不再、子女无心无力接班的难题，企业家如何找到突围之路？",
        },
        {
            'title':"西藏将新建3个机场，力争2021年建成投用",
            'c':"西藏自治区和中国民用航空局共同确定，将新建山南隆子机场、日喀则定日机场、阿里普兰机场和拉萨贡嘎国际机场第二跑道等3个支线机场。这3个机场海拔均在4000米以上，将于2019年完成可行性研究报告、初步设计批复并开工建设，力争2019年开工建设，2021年建成投用。",
        },
        {
            'title':"蒋锡培：最根本的营商环境是法制环境，最重要的是同频共振和上下同欲",
            'c':"一、 依法保护所有合法财产《宪法》第十二条:社会主义的公共财产神圣不可侵犯。国家保护社会主义的公共财产。禁止任何组织或者个人用任何手段侵占或者破坏国家的和集体的财产。第十三条:公民的合法的私有财产不受侵犯。国家依照法律规定保护公民的私有财产权和继承权。国家为了公共利益的需要，可以依照法律规定对公民的私有财产实行征收或者征用并给予补偿。建议将第十三条修改为:公民的合法的私有财产同样神圣不可侵犯。国家依照法律规定保护公民的私有财产权和继承权。国家为了公共利益的需要，可以依照法律规定对公民的私有财产实行征收或者征用并给予合理就高补偿。坚持贯彻国务院办公厅2018年发布《关于开展涉及产权保护的规章、规范性文件清理工作的通知》（国办发〔2018〕29号）等精神，更好地让恒产者有恒心。",
        },
        
    ]
    hangye = [
        {
            'title':"港珠澳大桥通车仪式举行 远东电缆点亮世界最长跨海大桥",
            'c':"10月23日，世界最长跨海大桥——港珠澳大桥通车仪式在珠海举行，国家主席习近平出席仪式并宣布大桥正式开通。作为港珠澳大桥主体工程交通工程战略供应商，远东智慧能源股份有限公司（简称：智慧能源，股票代码600869）为港珠澳大桥项目提供了优质的产品和服务。",
        },
        {
            'title':"京航安：智慧机场业务稳步发展，助推“一带一路”战略落地",
            'c':"京航安：智慧机场业务稳步发展，助推“一带一路”战略落地",
        },
        {
            'title':"智慧能源：三季报净利大增103.99%，“电缆龙头+行业方案”齐发力",
            'c':" 10月，上市公司三季报密集披露。20日，智能电缆制造龙头智慧能源(600869)公告了三季报业绩。公司前三季度实现营业收入126.48亿元，归母净利润2.98亿元，同比增长103.99%，归母扣非净利润2.54亿元，同比增长120.37%。同时加强对应收账款管理，经营性现金流大幅上升，比去年同期增长64.88%，加权平均净资产收益率大幅上升达5.64%，比去年同期增加119%。智慧能源(600869)今年以来，保持较高的增长势头，三季报营业收入和净利润持续双增长，彰显核心竞争力和市场影响力的提升。",
        },
    ]  
    # print slides,slides.count()
    return render(request, 'index.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def about(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[1]['active'] = True
    return render(request, 'about.html',locals())


@csrf_exempt
# @login_required(login_url="/login/")
def news(request):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[2]['active'] = True
    hangye = News.objects.filter(t=1).order_by('-id')[:6]
    gongsi = News.objects.filter(t=2).order_by('-id')[:6]
    return render(request, 'index.html',locals())
    # return render(request, 'news.html',locals())


@csrf_exempt
# @login_required(login_url="/login/")
def news_detail(request,ID):
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[2]['active'] = True
    detail = News.objects.get(id=ID)
    return render(request, 'index.html',locals())
    # return render(request, 'news_detail.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def yewu(request):
    # 业务范围
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[3]['active'] = True
    return render(request, 'index.html',locals())
    # return render(request, 'portfolio.html',locals())

@csrf_exempt
# @login_required(login_url="/login/")
def xiangmu(request):
    # 项目展示
    # return render_to_response('index.html')
    menus = copy.deepcopy(MENUS)
    menus[4]['active'] = True
    return render(request, 'index.html',locals())
    # return render(request, 'services.html',locals())