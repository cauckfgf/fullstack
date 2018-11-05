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
            'title':"京航安岳阳机场项目部：向业主递交一份满意的答卷",
            'c':"岳阳机场助航灯光项目自17年5月进场以来，在公司领导和各部门的关心帮助下，已圆满地完成了各项施工任务，现已进入收尾和结算阶段。在这一年半的施工过程中，项目部全体人员团结一心，克服困难，各项工作做到井然有序，按规范操作，受到业主和监理单位的好评。特别是行业验收后，董事长来岳阳机场检查工作时提出，因灯光站土建单位未做好防水工作而浸泡我们的电缆沟，影响外观，全部重新返工，包括外场灯箱盖也全部重新刷漆，费用由公司承担，此项工作完成后得到使用单位的高度肯定。",
        },
        {
            'title':"肖共长董事长莅临京航安青岛新机场项目部现场指导工作",
            'c':"11月1日，肖董事长莅临青岛胶东国际机场，视察弱电项目PCR 核心机房、跑道灯光施工情况。项目经理向董事长汇报了施工过程中遇到的问题和采取的措施，对施工工艺做了详细汇报，表达了持续改进，精益求精的追求。",
        },
        {
            'title':"图说：京航安马尔代夫维拉纳国际机场助航灯光工程施工",
            'c':"无内容",
        },
        
    ]
    jituan = [
        {
            'title':"智慧能源21700锂电龙头线下沟通会在宜春圆满召开",
            'c':"近日，远东智慧能源股份有限公司（简称：智慧能源 股票代码：600869）在江西宜春成功举办了2018年机构投资者沟通会，中国银行、工商银行、建设银行、招商证券、民生证券等33家银行、券商与二级市场投资机构参加了本次活动。投资人、远东控股集团董事、党委副书记、智慧能源董事长蒋承志，投资人、智慧能源董事、董事会秘书王征，远东福斯特新能源江苏有限公司（简称：福斯特江苏）董事、总经理吴松坚，福斯特江苏首席科学家薛嘉渔，投资人、远东福斯特常务副总经理杨闯，远东福斯特副总经理相江峰，投资人、远东福斯特副总经理付祖堂，投资人、远东福斯特总经理助理蔡李荃、程松，投资人、远东福斯特资深总监尹晓青，投资人、远东福斯特监审总监关智进，投资人、集团资金管理部负责人周寅，投资人、智慧能源副总监、远东福斯特高级总监蒋俭，投资人、远东福斯特财务负责人周明等领导出席会议。",
        },
        {
            'title':"智慧能源：三季报净利大增103.99%，“电缆龙头+行业方案”齐发力",
            'c':" 10月，上市公司三季报密集披露。20日，智能电缆制造龙头智慧能源(600869)公告了三季报业绩。公司前三季度实现营业收入126.48亿元，归母净利润2.98亿元，同比增长103.99%，归母扣非净利润2.54亿元，同比增长120.37%。同时加强对应收账款管理，经营性现金流大幅上升，比去年同期增长64.88%，加权平均净资产收益率大幅上升达5.64%，比去年同期增加119%。智慧能源(600869)今年以来，保持较高的增长势头，三季报营业收入和净利润持续双增长，彰显核心竞争力和市场影响力的提升。",
        },
        {
            'title':"瑞典Vattenfall公司大型太阳能工程与工程项目领导来访远东",
            'c':"10月29日，瑞典Vattenfall公司大型太阳能工程与工程项目负责人Ivo van Dam，亚太区高级市场经理Nardi Polak，高级采购经理Ron Sperber及CUSP公司项目经理Summer Cui一行来访远东参观交流。",
        },
    ]
    hangye = [
        {
            'title':"致敬改革开放40年，展望光明未来30年：企业家如何顺势而起？",
            'c':"2018年是改革开放40周年，也是十九大“一张蓝图绘到底”、实现民族复兴的开局之年。回首过去风雨兼程的40年，展望未来波澜壮阔的30年，身处历史关键节点，身临国内外盘根错节的经济形势和市场状况，企业家如何才能坚定信心、读懂时代并看清未来？面临高管团队激情不再、子女无心无力接班的难题，企业家如何找到突围之路？",
        },
        {
            'title':"转载：一带一路中国版全球化：中国在非洲建设的主要机场项目",
            'c':"查德政府宣布，与中国签署价值10亿美元的协议，在查德首都附近修建一个国际机场。项目由中工国际工程股份有限公司承担。查德基础设施部部长说，工程项目由中国政府提供的贷款兴建，将帮助查德成为非洲飞往中东和亚洲航班的基地。",
        },
        {
            'title':"湛江机场迁建工程总体规划通过专家评审",
            'c':"受民航局机场司委托，中国国际工程咨询有限公司于2018年10月22日至24日，在广东省湛江市组织召开了《湛江迁建机场总体规划》评审会。民航单位、南部战区空军、地方政府相关部门以及建设、设计和咨询单位等有关人员参加会议。会议邀请了机场规划、总图工程、需求分析、空域规划、空管工程、航行服务、供油工程、配套工程、综合交通规划等专业的多名专家参加评审。",
        }
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