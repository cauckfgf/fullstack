# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth.decorators import login_required
from django.template import loader, Context, RequestContext
from django.template.loader import get_template
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from rest_framework import viewsets,generics,pagination,filters
from rest_framework_filters.backends import DjangoFilterBackend
from .models import *
from .serializers import *
from Xinhua.commomfun import returnSucc,returnError,checkMobile
from dss.Serializer import serializer as objtojson
import rest_framework_filters
from rest_framework.decorators import detail_route, list_route
from rest_framework_extensions.cache.mixins import CacheResponseMixin
import json
from django.db.models import Count,Sum
from Xinhua.commomfun import DEPNAME
from User.models import WeixinMessage
from dateutil.relativedelta import relativedelta
@csrf_exempt
@login_required(login_url="/login/")
def smt_main(request):
    c = RequestContext(request, locals())
    if checkMobile(request):
        t=get_template('SMT/smt_main.html')
    else:
        t=get_template('SMT/smt_main.html')
    return HttpResponse(t.render(c))

@csrf_exempt
@login_required(login_url="/login/")
def smt(request):
    c = RequestContext(request, locals())
    html = request.GET.get('html','main')
    if checkMobile(request):
        t=get_template('SMT/smt_%s.html'%(html))
    else:
        t=get_template('SMT/smt_%s.html'%(html))
    return HttpResponse(t.render(c))

@csrf_exempt
@login_required(login_url="/login/")
def xungeng(request):
    c = RequestContext(request, locals())
    if checkMobile(request):
        t=get_template('SMT/smt_xungeng.html')
    else:
        t=get_template('SMT/smt_xungeng.html')
    return HttpResponse(t.render(c))

@csrf_exempt
def camerabyip(request):
    ip = request.GET.get('ip','192.168.5.44')
    pw = request.GET.get('pw','admin')
    c = RequestContext(request, locals())
    t=get_template('SMT/camerabyip.html')
    return HttpResponse(t.render(c))

@csrf_exempt
def entrance(request):
    c = RequestContext(request, locals())
    t=get_template('SMT/smt_entrance.html')
    return HttpResponse(t.render(c))

class myPagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'pagesize'
    max_page_size = 1000


class CameraTypeFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = CameraType
        fields = {
            'name': ['exact'],
        }

class CameraTypeSet(viewsets.ModelViewSet):
    queryset = CameraType.objects.all()
    serializer_class = CameraTypeSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = CameraTypeFilter
    ordering_fields = ('name',)
    pagination_class = myPagination

class CameraFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Camera
        fields = {
            'name': ['exact'],
            'id':['in'],
            'room__floor':['exact'],
            'room':['exact'],
            'floor':['exact'],
            'model__ModelUrl2Model__dbid':['exact','in'],
            'model__ModelUrl':['exact'],
            'room__modelguid':['exact'],
            'room__room_guid':['exact'],
            'model__guid':['exact'],
        }

class CameraSet(CacheResponseMixin,viewsets.ModelViewSet):
    queryset = Camera.objects.filter(onLineStatus=1)
    serializer_class = CameraSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = CameraFilter
    ordering_fields = ('name',)
    search_fields = ('name',)
    pagination_class = myPagination
    @list_route(methods=['get'])
    def tongji(self, request):
        # floor = request.GET.get('floor',None)
        # if floor:
        #     online = Camera.objects.filter(onLineStatus=1,floor_id=floor).count()
        #     offline = Camera.objects.filter(onLineStatus=0,floor_id=floor).count()
        # else:
        #     online = Camera.objects.filter(onLineStatus=1).count()
        #     offline = Camera.objects.filter(onLineStatus=0).count()

        tmp = list(Camera.objects.filter(onLineStatus=1).values('floor__name').annotate(num_canmera=Count('id')))
        return JsonResponse({'data':tmp})


class ScreenshotFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Screenshot
        fields = {
            'describe': ['exact'],
        }

class ScreenshotSet(viewsets.ModelViewSet):
    queryset = Screenshot.objects.all()
    serializer_class = ScreenshotSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = ScreenshotFilter
    ordering_fields = ('name',)
    pagination_class = myPagination

class PathSetingFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = PathSeting
        fields = {
            'name': ['exact'],
        }

class PathSetingSet(viewsets.ModelViewSet):
    queryset = PathSeting.objects.all()
    serializer_class = PathSetingSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = PathSetingFilter
    ordering_fields = ('name',)
    pagination_class = myPagination


class AlarmtypeFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Alarmtype
        fields = {
            'name': ['exact'],
        }

class AlarmtypeSet(CacheResponseMixin,viewsets.ModelViewSet):
    queryset = Alarmtype.objects.all()
    serializer_class = AlarmtypeSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = AlarmtypeFilter
    ordering_fields = ('name',)
    pagination_class = myPagination

class AlarmFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Alarm
        fields = {
            'station__IsAlarming': ['exact'],
            'room': ['exact'],
            'floor': ['exact'],
            'model__ModelUrl2Model__dbid':['exact','in'],
        }

class AlarmSet(viewsets.ModelViewSet):
    queryset = Alarm.objects.all()
    serializer_class = AlarmSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    filter_class = AlarmFilter
    ordering_fields = ('station__IsAlarming','warning__time')
    pagination_class = myPagination
    search_fields = ('name',)

class StationFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Station
        fields = {
            'name': ['exact'],
        }

class StationSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = StationFilter
    ordering_fields = ('name',)
    pagination_class = myPagination

class PeopleFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = People
        fields = {
            'camera': ['exact'],
            'footfallStartTime': ['range'],
            'camera__name': ['exact'],
        }

class PeopleSet(viewsets.ModelViewSet):
    queryset = People.objects.all()
    serializer_class = PeopleSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = PeopleFilter
    ordering_fields = ('footfallStartTime','id')
    pagination_class = myPagination

    @list_route(methods=['get'])
    def today(self, request):
        today = datetime.date.today()
        p = People.objects.filter(footfallStartTime__gt=today)
        p = p.values('passengersIn','passengersOut')
        list_in = []
        list_out = []
        for each in p:
            list_in.append(each['passengersIn'])
            list_out.append(each['passengersOut'])
        return JsonResponse({'in':sum(list_in), 'out':sum(list_out)})

    @list_route(methods=['get'])
    def churukou(self, request):
        r=set(People.objects.values_list('camera__name',flat=True))
        return JsonResponse({'data':list(r)})

class PeopleBaseSet(viewsets.ModelViewSet):
    queryset = PeopleBase.objects.all()
    serializer_class = PeopleBaseSerializer

class CarFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Car
        fields = {
            'time' : ['range'],
            
        }
class CarSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time', 'id')
    pagination_class = myPagination
    filter_class = CarFilter
    @list_route(methods=['get'])
    def today(self, request):
        today = datetime.date.today()
        p = Car.objects.filter(time__gt=today)
        i = p.filter(inout='in').values_list('number',flat=True)
        o = p.filter(inout='out').values_list('number',flat=True)

        return JsonResponse({'in':sum(i), 'out':sum(o)})

class CarBaseSet(viewsets.ModelViewSet):
    queryset = CarBase.objects.all()
    serializer_class = CarBaseSerializer

class CarRecordFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = CarRecord
        fields = {
            'time' : ['range'],
            'carOut' : ['exact'],
            'entranceName': ['exact'],

        }
class CarRecordSet(viewsets.ModelViewSet):
    queryset = CarRecord.objects.all()
    serializer_class = CarRecordSerializer
    filter_class = CarRecordFilter
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter)
    search_fields = ("plateNo", )
    ordering_fields = ('time', 'id')
    pagination_class = myPagination

    @list_route(methods=['get'])
    def churukou(self, request):
        r=set(CarRecord.objects.values_list('entranceName',flat=True))
        return JsonResponse({'data':list(r)})

    @list_route(methods=['get'])
    def quxian(self, request):
        src = CarRecord.objects.all()
        timeRange = request.GET.get('time__range')
        if timeRange:
            timeRange = timeRange.split(',')
            src = src.filter(time__range=timeRange)
        entranceName =  request.GET.get('entranceName')
        if entranceName:
            src = src.filter(entranceName=entranceName)
        carOut =  request.GET.get('carOut')
        if carOut:
            src = src.filter(carOut=int(carOut))
        src = src.extra(select={'datestr': "DATE_FORMAT(time, '%%Y-%%m-%%d %%H:00:00')"}).order_by('datestr')
        src = src.values('datestr').annotate(Count('id'))
        return JsonResponse({'data':list(src)})
   
class WarningFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Warning
        fields = {
            # 'alarm': '__all__',
            'alarm' : ['exact'],
            # 'alarm__IsAlarming' : ['exact'],
            'station__describe' : ['contains','in','icontains'],
            'station__IsAlarming' : ['exact'],
            'id':['gt','gte']
        }

class WarningSet(viewsets.ModelViewSet):
    queryset = Warning.objects.all()
    serializer_class = WarningSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = WarningFilter
    ordering_fields = ('time','id')
    pagination_class = myPagination


class EntranceguardFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = Entranceguard
        fields = {
            'OpenState': ['exact'],
        }

class EntranceguardSet(viewsets.ModelViewSet):
    queryset = Entranceguard.objects.all()
    serializer_class = EntranceguardSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = EntranceguardFilter
    ordering_fields = ('OpenState',)
    pagination_class = myPagination

class EntranceCardInfoFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = EntranceCardInfo
        fields = {
            'cardCode': ['exact'],
        }

class EntranceCardInfoSet(viewsets.ModelViewSet):
    queryset = EntranceCardInfo.objects.all()
    serializer_class = EntranceCardInfoSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = EntranceCardInfoFilter
    ordering_fields = ('cardCode',)
    pagination_class = myPagination

class EgentranceControlValueFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = EgentranceControlValue
        fields = {
            'entranceControl': ['exact'],
        }



class EgentranceControlValueSet(viewsets.ModelViewSet):
    queryset = EgentranceControlValue.objects.all()
    serializer_class = EgentranceControlValueSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = EgentranceControlValueFilter
    ordering_fields = ('entranceControl',)
    pagination_class = myPagination



        
class ProvinceSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    # filter_class = ProvinceFilter
    ordering_fields = ('id',)
    pagination_class = myPagination

class CitySet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    # filter_class = CityFilter
    ordering_fields = ('id',)
    pagination_class = myPagination

class PersonSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    # filter_class = PersonFilter
    ordering_fields = ('id',)
    pagination_class = myPagination

class PersonWarnFilter(rest_framework_filters.FilterSet):
    class Meta:
        model = PersonWarn
        fields = {
            'person': ['exact'],
            'camera__model__ModelUrl':['exact'],
            'time': ['range'],
        }


class PersonWarnSet(viewsets.ModelViewSet):
    queryset = PersonWarn.objects.all()
    serializer_class = PersonWarnSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = PersonWarnFilter
    ordering_fields = ('id','time')
    pagination_class = myPagination

    @list_route(methods=['post'])
    def test(self, request):
        # body = json.loads(request.body)
        # log_id = body.get('log_id',None)
        # if PersonWarn.objects.filter(log_id=log_id).count()==0:
        #     cameraUuid = body.get('cameraUuid',None)
        #     c  = Camera.objects.get(cameraUuid=cameraUuid)
        #     PersonWarn.objects.create(camera=c,log_id=log_id)
        # PersonWarn.objects.last().weixin()

        return returnSucc(None)
    @list_route(methods=['get'])
    def echart(self, request):
        src = PersonWarn.objects.all()
        timeRange = request.GET.get('time__range')
        if timeRange:
            timeRange = timeRange.split(',')
            src = src.filter(time__range=timeRange)
        data = src.values('person__personName','person_id').annotate(Count('id'))
        return JsonResponse({'data':list(data)})

    @list_route(methods=['post'])
    def warn(self, request):
        try:
            body = json.loads(request.body)
            log_id = body.get('log_id',None)
            if PersonWarn.objects.filter(log_id=log_id).count()==0:
                extInfo = eval(body.get('extInfo',None))
                timestr = extInfo[0]['snap']['absTimeStr']
                faces = extInfo[0]['faces']
                for face in faces:
                    name = face['humanAttr']['name']
                    birthDate = face['humanAttr']['birthDate']
                    if birthDate:
                        birthDate = datetime.datetime.strptime(birthDate,'%Y-%m-%d')
                    try:
                        p=Person.objects.get(personName=name,birthday__range=(birthDate,birthDate+relativedelta(days=1)))
                    except:
                        p=Person.objects.filter(personName=name).last()
                        if not p:
                            return returnSucc(None)
                    cameraUuid = body.get('cameraUuid',None)
                    cameraName = body.get('cameraName',None)
                    try:
                        c  = Camera.objects.get(name=cameraName)
                    except:
                        c = Camera.objects.create(name=cameraName,code=cameraName,cameraUuid=cameraUuid)
                    p = PersonWarn.objects.create(time=timestr,person=p,camera=c,log_id=log_id,degbug=str(body))
                    p.weixin()
            return returnSucc(None)
        except:
            traceback.print_exc()

class PersonGroupSet(viewsets.ModelViewSet):
    queryset = PersonGroup.objects.all()
    serializer_class = PersonGroupSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    # filter_class = PersonGroupFilter
    ordering_fields = ('id',)
    pagination_class = myPagination


class LwbhszSet(viewsets.ModelViewSet):
    queryset = Lwbhsz.objects.all()
    serializer_class = LwbhszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination


class LwdtjhssSet(viewsets.ModelViewSet):
    queryset = Lwdtjhss.objects.all()
    serializer_class = LwdtjhssSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwdtjhszSet(viewsets.ModelViewSet):
    queryset = Lwdtjhsz.objects.all()
    serializer_class = LwdtjhszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwdyzSet(viewsets.ModelViewSet):
    queryset = Lwdyz.objects.all()
    serializer_class = LwdyzSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwjhkhSet(viewsets.ModelViewSet):
    queryset = Lwjhkh.objects.all()
    serializer_class = LwjhkhSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwjhszSet(viewsets.ModelViewSet):
    queryset = Lwjhsz.objects.all()
    serializer_class = LwjhszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwjhxlSet(viewsets.ModelViewSet):
    queryset = Lwjhxl.objects.all()
    serializer_class = LwjhxlSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwloginSet(viewsets.ModelViewSet):
    queryset = Lwlogin.objects.all()
    serializer_class = LwloginSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwmainSet(viewsets.ModelViewSet):
    queryset = Lwmain.objects.all()
    serializer_class = LwmainSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwmaintempSet(viewsets.ModelViewSet):
    queryset = Lwmaintemp.objects.all()
    serializer_class = LwmaintempSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwnhddSet(viewsets.ModelViewSet):
    queryset = Lwnhdd.objects.all()
    serializer_class = LwnhddSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwnhrySet(viewsets.ModelViewSet):
    queryset = Lwnhry.objects.all()
    serializer_class = LwnhrySerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwsjszSet(viewsets.ModelViewSet):
    queryset = Lwsjsz.objects.all()
    serializer_class = LwsjszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwsysSet(viewsets.ModelViewSet):
    queryset = Lwsys.objects.all()
    serializer_class = LwsysSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwwxjhssSet(viewsets.ModelViewSet):
    queryset = Lwwxjhss.objects.all()
    serializer_class = LwwxjhssSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwwxjhszSet(viewsets.ModelViewSet):
    queryset = Lwwxjhsz.objects.all()
    serializer_class = LwwxjhszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwxlmcSet(viewsets.ModelViewSet):
    queryset = Lwxlmc.objects.all()
    serializer_class = LwxlmcSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwxlszSet(viewsets.ModelViewSet):
    queryset = Lwxlsz.objects.all()
    serializer_class = LwxlszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwyxjhssSet(viewsets.ModelViewSet):
    queryset = Lwyxjhss.objects.all()
    serializer_class = LwyxjhssSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class LwyxjhszSet(viewsets.ModelViewSet):
    queryset = Lwyxjhsz.objects.all()
    serializer_class = LwyxjhszSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class SmtPatrolstickSet(viewsets.ModelViewSet):
    queryset = SmtPatrolstick.objects.all()
    serializer_class = SmtPatrolstickSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class SmtPatrolpathSet(viewsets.ModelViewSet):
    queryset = SmtPatrolpath.objects.all()
    serializer_class = SmtPatrolpathSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class SmtPatrolpositionSet(viewsets.ModelViewSet):
    queryset = SmtPatrolposition.objects.all()
    serializer_class = SmtPatrolpositionSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ('time',)
    pagination_class = myPagination

class SmtPatrolrecordFliter(rest_framework_filters.FilterSet):
    class Meta:
        model = SmtPatrolrecord
        fields = {
            'starttime':['gte'],
            'endtime': [ 'lte'],
        }
class SmtPatrolrecordSet(viewsets.ModelViewSet):
    queryset = SmtPatrolrecord.objects.all()
    serializer_class = SmtPatrolrecordSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = SmtPatrolrecordFliter
    ordering_fields = ('time',)
    pagination_class = myPagination

class SmtPatrolRecord2PositionSerializerFliter(rest_framework_filters.FilterSet):
    class Meta:
        model = SmtPatrolRecord2Position
        fields = {
            'smtpatrolrecord':['exact'],
        }

class SmtPatrolRecord2PositionSet(viewsets.ModelViewSet):
    queryset = SmtPatrolRecord2Position.objects.all()
    serializer_class = SmtPatrolRecord2PositionSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_class = SmtPatrolRecord2PositionSerializerFliter
    ordering_fields = ('time',)
    pagination_class = myPagination

alarmEvent = { 
    "A100":"外出布防",
    "A101":"用户布防",
    "A102":"留守布防",
    "A103":"部分布防",
    "A104":"特殊布防",
    "A105":"强制布防",
    "A106":"刷卡布防被授权",
    "A107":"用户撤防",
    "A108":"部分撤防",
    "A109":"特殊撤防",
    "A110":"外出延时",
    "A111":"进入延时",
    "A112":"子系统就绪",
    "A113":"子系统未就绪",
    "A114":"布防失败",
    "A115":"子系统忙",
    "A116":"没有布防",
    "A117":"没有撤防",
    "A118":"子系统报警",
    "A119":"子系统撤防",
    "A120":"子系统布防",
    "A121":"自动布防",
    "A122":"自动撤防",
    "A123":"消警",
    "A124":"集体布防",
    "A125":"集体撤防",
    "A126":"过迟布防",
    "A127":"过迟撤防",
    "A128":"遥控布防",
    "A129":"遥控撤防",
    "A130":"快速布防",
    "A131":"快速撤防",
    "A132":"操作员在现场",
    "A133":"最近布防",
    "A134":"延迟撤防",
    "A135":"延迟布防",
    "A136":"开关锁撤防",
    "A137":"开关锁布防",
    "A138":"非正常时段撤防",
    "A139":"非正常时段布防",
    "A140":"过早撤防",
    "A141":"过早布防",
    "A142":"撤防失败",
    "A143":"自动布防失败",
    "A144":"外出错误",
    "A145":"外出错误恢复",
    "A200":"防区就绪",
    "A201":"防区未就绪",
    "A202":"防区报警",
    "A203":"防区报警恢复",
    "A204":"防区旁路",
    "A205":"防区旁路恢复",
    "A206":"防区故障",
    "A207":"防区故障恢复",
    "A208":"防区防拆",
    "A209":"防区防拆恢复",
    "A210":"防区总线故障",
    "A211":"防区总线故障恢复",
    "A212":"火警报警",
    "A213":"火警报警恢复",
    "A214":"火警故障",
    "A215":"火警故障恢复",
    "A216":"烟感报警",
    "A217":"烟感报警恢复",
    "A218":"烟感故障",
    "A219":"烟感故障恢复",
    "A220":"水淹报警",
    "A221":"水淹报警恢复",
    "A222":"水淹故障",
    "A223":"水淹故障恢复",
    "A224":"火警按钮报警",
    "A225":"火警按钮报警恢复",
    "A226":"辅助求助按钮报警",
    "A227":"辅助求助按钮报警恢复",
    "A228":"劫警报警",
    "A229":"劫警报警恢复",
    "A230":"挟持报警",
    "A231":"挟持报警恢复",
    "A232":"无线防区低电压",
    "A233":"无线防区低电压恢复",
    "A234":"窃盗报警发生",
    "A235":"窃盗报警恢复",
    "A236":"无声劫盗",
    "A237":"无声劫盗恢复",
    "A238":"有声劫盗",
    "A239":"有声劫盗恢复",
    "A240":"劫盗",
    "A241":"劫盗恢复",
    "A242":"日/夜防区报警",
    "A243":"日/夜防区报警恢复",
    "A244":"内部防区报警",
    "A245":"内部防区报警恢复",
    "A246":"出/入防区报警",
    "A247":"出/入防区报警恢复",
    "A248":"周边防区报警",
    "A249":"周边防区报警恢复",
    "A250":"24小时防区报警",
    "A251":"24小时防区报警恢复",
    "A252":"24小时非窃盗报警",
    "A253":"24小时非窃盗报警恢复",
    "A254":"接近警报",
    "A255":"接近警报恢复",
    "A256":"一般报警",
    "A257":"一般报警恢复",
    "A258":"总线开路",
    "A259":"总线开路恢复",
    "A260":"总线短路",
    "A261":"总线短路恢复",
    "A263":"探测器防拆",
    "A264":"探测器防拆恢复",
    "A265":"24小时防区旁路",
    "A266":"24小时防区旁路恢复",
    "A267":"窃盗旁路",
    "A268":"窃盗旁路恢复",
    "A269":"集体旁路",
    "A270":"集体旁路恢复",
    "A271":"火警旁路",
    "A272":"火警旁路恢复",
    "A273":"医疗求助警报",
    "A274":"医疗求助警报恢复",
    "A275":"个人紧急救护警报",
    "A276":"个人紧急救护警报恢复",
    "A277":"报到失败",
    "A278":"报到失败恢复",
    "A279":"燃烧警报",
    "A280":"燃烧警报恢复",
    "A281":"消防水流警报",
    "A282":"消防水流警报恢复",
    "A283":"热感探头警报",
    "A284":"热感探头警报恢复",
    "A285":"空调槽烟感报警",
    "A286":"空调槽烟感恢复",
    "A287":"热感探头报警",
    "A288":"热感探头报警恢复",
    "A289":"进入允许挟持",
    "A290":"进入允许挟持恢复",
    "A291":"外出允许挟持",
    "A292":"外出允许挟持恢复",
    "A293":"室外防区报警",
    "A294":"室外防区报警恢复",
    "A295":"气体警报",
    "A296":"气体警报恢复",
    "A297":"冷藏器警报",
    "A298":"冷藏器警报恢复",
    "A299":"加热系统警报",
    "A2A0":"温度过高报警恢复",
    "A2A1":"漏水报警",
    "A2A2":"漏水报警恢复",
    "A2A3":"防区箔片破损",
    "A2A4":"防区箔片破损恢复",
    "A2A5":"日间防区报警",
    "A2A6":"日间防区报警恢复",
    "A2A7":"气体水平过低报警",
    "A2A8":"气体水平过低报警恢复",
    "A2A9":"温度过高报警",
    "A2AA":"加热系统警报恢复",
    "A2B0":"温度过低报警",
    "A2B1":"温度过低报警恢复",
    "A2B2":"空气流动报警",
    "A2B3":"空气流动报警恢复",
    "A2B4":"一氧化碳探测报警",
    "A2B5":"一氧化碳探测报警恢复",
    "A2B6":"油箱液位故障",
    "A2B7":"油箱液位故障恢复",
    "A2B8":"火警监视",
    "A2B9":"火警监视恢复",
    "A2C0":"水压过低",
    "A2C1":"水压过低恢复",
    "A2C2":"二氧化碳过低",
    "A2C3":"二氧化碳过低恢复",
    "A2C4":"阀门感应",
    "A2C5":"阀门感应恢复",
    "A2C6":"水位过低",
    "A2C7":"水位过低恢复",
    "A2C8":"水泵开动",
    "A2C9":"水泵开动恢复",
    "A2D0":"交换旁路",
    "A2D1":"交换旁路恢复",
    "A2D2":"紧急报警复位",
    "A2D3":"紧急报警复位恢复",
    "A2D4":"取消旁路",
    "A2D5":"六氟化硫报警",
    "A2D6":"六氟化硫报警恢复",
    "A2D7":"风机关闭",
    "A2D8":"风机启动",
    "A300":"报警主机电池故障",
    "A301":"报警主机电池故障恢复",
    "A302":"报警主机交流电故障",
    "A303":"报警主机交流电故障恢复",
    "A304":"报警主机辅助输出故障",
    "A305":"报警主机辅助输出故障恢复",
    "A306":"警铃#1故障",
    "A307":"警铃#1故障恢复",
    "A308":"Combus通信总线低电压",
    "A309":"Combus通信总线低电压恢复",
    "A310":"电话线#1故障",
    "A311":"电话线#1故障恢复",
    "A312":"与接警机通讯失败",
    "A313":"与接警机通讯失败恢复",
    "A314":"缓冲器满",
    "A315":"接地故障",
    "A316":"接地故障恢复",
    "A317":"常规系统故障",
    "A318":"常规系统故障恢复",
    "A319":"与Combus注册模块失去通信",
    "A320":"与Combus注册模块恢复通信",
    "A321":"无线按钮低电压",
    "A322":"无线按钮低电压恢复",
    "A323":"手持键盘低电压",
    "A324":"手持键盘低电压恢复",
    "A325":"系统防拆发生",
    "A326":"系统防拆发生恢复",
    "A327":"振铃",
    "A328":"设备时间报告",
    "A329":"键盘锁定",
    "A330":"命令输出执行中",
    "A331":"非法访问",
    "A332":"家庭自动化故障",
    "A333":"家庭自动化故障恢复",
    "A334":"故障灯亮",
    "A335":"故障灯灭",
    "A336":"打印输出故障",
    "A337":"打印输出故障恢复",
    "A338":"电池测试失败",
    "A339":"电池测试失败恢复",
    "A340":"无线堵塞",
    "A341":"无线堵塞恢复",
    "A342":"继电器故障",
    "A343":"继电器故障恢复",
    "A344":"扩展器故障",
    "A345":"扩展器故障恢复",
    "A346":"扩展器短路",
    "A347":"扩展器短路恢复",
    "A348":"扩展模块防拆",
    "A349":"扩展模块防拆恢复",
    "A350":"无线接收机故障",
    "A351":"无线接收机故障恢复",
    "A352":"系统复位",
    "A353":"进入编程",
    "A354":"退出编程",
    "A355":"编程改变",
    "A356":"进入测试",
    "A357":"退出测试",
    "A358":"日志清空",
    "A359":"日志溢出",
    "A360":"日志已经50%",
    "A361":"日志已经90%",
    "A362":"输入错误",
    "A363":"时间错误",
    "A364":"设置时间",
    "A365":"退出错误",
    "A366":"取消",
    "A367":"按键输入错误",
    "A368":"复位",
    "A369":"限制使用",
    "A370":"自检",
    "A371":"栈溢出",
    "A372":"未测试",
    "A373":"测试中",
    "A374":"添加用户",
    "A375":"修改用户",
    "A376":"删除用户",
    "A377":"报警主机电池低电压",
    "A378":"报警主机电池低电压恢复",
    "A379":"防区布防",
    "A380":"防区撤防",
    "A381":"MX设备布防",
    "A382":"MX设备撤防",
    "A383":"MX设备防区报警",
    "A384":"MX设备防区报警恢复",
    "A385":"智能防区启用监测",
    "A386":"智能防区监测计时启动",
    "A387":"智能防区停止监测",
    "A388":"感应器故障",
    "A389":"感应器故障恢复",
    "A390":"探测器监测失败",
    "A391":"探测器监测失败恢复",
    "A392":"警铃#2故障",
    "A393":"警铃#2故障恢复",
    "A394":"LRR/ECP外设连接故障",
    "A395":"失去LRR/ECP外设监测",
    "A396":"中继器故障",
    "A397":"中继器故障恢复",
    "A398":"打印缺纸",
    "A399":"打印缺纸恢复",
    "A400":"扩展模块电源丢失",
    "A401":"扩展模块电源丢失恢复",
    "A402":"扩展模块电池低电压",
    "A403":"扩展模块电池低电压恢复",
    "A404":"扩展模块复位",
    "A405":"扩展模块复位恢复",
    "A406":"扩展模块AC电源丢失",
    "A407":"扩展模块AC电源丢失恢复",
    "A408":"扩展模块自测失败",
    "A409":"扩展模块自测失败恢复",
    "A410":"通讯故障",
    "A411":"通讯故障恢复",
    "A412":"电话线#2故障",
    "A413":"电话线#2故障恢复",
    "A414":"长距离无线发射器故障",
    "A415":"长距离无线发射器故障恢复",
    "A416":"失去长距离无线中心监控",
    "A417":"失去长距离无线中心监控恢复",
    "A418":"保护回路",
    "A419":"保护回路恢复",
    "A420":"保护回路开路",
    "A421":"保护回路开路恢复",
    "A422":"保护回路短路",
    "A423":"保护回路短路恢复",
    "A424":"无线监控故障",
    "A425":"无线监控故障恢复",
    "A426":"无线感应器电池过低",
    "A427":"无线感应器电池过低恢复",
    "A428":"增加模块",
    "A429":"删除模块",
    "A430":"通讯器停用",
    "A431":"通讯器停用恢复",
    "A432":"禁用遥控编程",
    "A433":"恢复遥控编程",
    "A434":"无线发射器停用",
    "A435":"无线发射器停用恢复",
    "A436":"手动测试",
    "A437":"定期测试",
    "A438":"定期无线发射器测试",
    "A439":"时间日期不准确",
    "A440":"日期重新设置",
    "A441":"改动时间表",
    "A442":"改动例外时间表",
    "A443":"改动出入时间表",
    "A444":"感应器监视故障",
    "A445":"感应器监视故障恢复",
    "A446":"报警图像传输",
    "A447":"点测试正常",
    "A448":"火警测试",
    "A449":"火警测试恢复",
    "A450":"状态报告",
    "A451":"状态报告恢复",
    "A452":"监听",
    "A453":"步行测试模式",
    "A454":"步行测试模式恢复",
    "A455":"系统故障保持",
    "A456":"总线监控故障",
    "A457":"总线监控故障恢复",
    "A458":"感应器防拆",
    "A459":"感应器防拆恢复",
    "A460":"水泵故障",
    "A461":"水泵故障恢复",
    "A462":"系统故障",
    "A463":"系统故障恢复",
    "A464":"RAM校验和故障",
    "A465":"ROM校验和故障",
    "A466":"自检故障",
    "A467":"系统重启",
    "A468":"自检故障恢复",
    "A469":"主机停机使用",
    "A470":"主机停机使用恢复",
    "A471":"丢失电池",
    "A472":"丢失电池恢复",
    "A473":"电源电流过大",
    "A474":"电源电流过大恢复",
    "A475":"工程师复位",
    "A476":"警号/继电器故障",
    "A477":"警号/继电器故障恢复",
    "A478":"警报继电器",
    "A479":"警报继电器恢复",
    "A480":"故障继电器",
    "A481":"故障继电器恢复",
    "A482":"逆转继电器",
    "A483":"逆转继电器恢复",
    "A484":"报告设备#3",
    "A485":"报告设备#3恢复",
    "A486":"报告设备#4",
    "A487":"报告设备#4恢复",
    "A488":"退出错误恢复",
    "A489":"劫警防区故障",
    "A490":"劫警防区故障恢复",
    "A491":"紧急防区故障",
    "A492":"紧急防区故障恢复",
    "A493":"交叉防区故障",
    "A494":"交叉防区故障恢复",
    "A495":"烟感探测器灵敏度过高",
    "A496":"烟感探测器灵敏度过高恢复",
    "A497":"烟感探测器灵敏度过低",
    "A498":"烟感探测器灵敏度过低恢复",
    "A499":"入侵探测器灵敏度过高",
    "A500":"入侵探测器灵敏度过高恢复",
    "A501":"入侵探测器灵敏度过低",
    "A502":"入侵探测器灵敏度过低恢复",
    "A503":"感应器自测失败",
    "A504":"感应器自测失败恢复",
    "A505":"感应器监控故障",
    "A506":"感应器监控故障恢复",
    "A507":"DriftCompensation错误",
    "A508":"DriftCompensation错误恢复",
    "A509":"维护报警",
    "A510":"维护报警恢复",
    "A511":"要求回电",
    "A512":"遥控编程下载成功",
    "A513":"遥控编程上载成功",
    "A514":"遥控失败",
    "A515":"关闭系统",
    "A516":"关闭系统恢复",
    "A517":"关闭通讯",
    "A518":"关闭通讯恢复",
    "A519":"故障继电器停用",
    "A520":"故障继电器停用恢复",
    "A521":"逆反继电器停用",
    "A522":"逆反继电器停用恢复",
    "A523":"报告设备#3停用",
    "A524":"报告设备#3停用恢复",
    "A525":"报告设备#4停用",
    "A526":"报告设备#4停用恢复",
    "A527":"输入错误码进入",
    "A528":"合法密码进入",
    "A529":"报警后重新布防",
    "A530":"自动布防时间伸展",
    "A531":"点未测试",
    "A532":"入侵防区不行测试",
    "A533":"火警防区步行测试",
    "A534":"紧急防区步行测试",
    "S202":"测试警报"
}
import json,datetime,traceback
@csrf_exempt
# @login_required(login_url="/login/")
def warn(request):
    if request.method == 'GET':
        c = RequestContext(request, locals())
        if checkMobile(request):
            t=get_template('SMT/smt_warn.html')
        else:
            t=get_template('SMT/smt_warn.html')
        return HttpResponse(t.render(c))
    elif request.method == 'POST':
        if request.META["HTTP_HOST"]=='nginx-host':

            try:
                AlertZoneName = request.POST.get('AlertZoneName')
                if AlertZoneName:
                    alarm = Alarm.objects.get_or_create(name=AlertZoneName)[0]
                    name = alarmEvent[request.POST.get('EventCode')]
                    station = Station.objects.get_or_create(name=name)[0]

                    level = request.POST.get('Level')
                    warn = Warning.objects.create(alarm=alarm, station=station,level=level)
                    if level in [1,2,3]:
                        before = None
                        if alarm.station:
                            before = alarm.station.IsAlarming
                        #如果已经是报警状态避免重复报警直接返回
                        alarm.station = station
                        alarm.save()
                        if not before and station.IsAlarming:
                            # floor = alarm.room.floor
                            # zones = alarm.room.Zone.all()
                            addr = ''
                            if alarm.room:
                                addr = alarm.room.fullname()
                            p = {   
                                "first":"您好",
                                "key1": alarm.station.name,
                                "key2": addr+alarm.name,
                                "key3": str(datetime.datetime.now()).split('.')[0] ,
                                "remark":"如有问题，请联系{}".format(DEPNAME)
                            }
                            wxm = WeixinMessage.objects.get(title='安防报警提醒')
                            e2us = wxm.e2u.all()
                            for  e2u in e2us:
                                for user in e2u.users.all():
                                    p['to_user'] = user
                                    wxm.sendwxmessage(1,**p)
                            # for each in WeixinMessage.objects.filter(e2u__warnlevel=station).filter(Q(e2u__floors=floor)|Q(zones=zones)):
                            #     each.sendwxmessage(**p)
                            # ele_by_floor =Element2User.objects.filter(floors = alarm.room.floor)
                            # ele_by_zone =Element2User.objects.filter(zones = alarm.room.Zone.all())
                            # 发送微信模板消息
            except:
                traceback.print_exc()
            return returnSucc(None)

def alarmtest():
    p = {   
        "first":"您好",
        "key1": '测试消息' ,
        "key2": '测试消息' ,
        "key3": str(datetime.datetime.now()).split('.')[0] ,
        "remark":"如有问题，请联系{}".format(DEPNAME)
    }
    wxm = WeixinMessage.objects.get(title='安防报警提醒')
    e2us = wxm.e2u.all()
    for  e2u in e2us:
        for user in e2u.users.all():
            p['to_user'] = user
            wxm.sendwxmessage(1,**p)

@csrf_exempt
# @login_required(login_url="/login/")
def checkonline(request):
    if request=='fgf' or request.META["HTTP_HOST"]=='nginx-host':
        try:
            secret = '9a7808bec80d4211b5fd7097750e3450'
            ip = '192.168.5.252'
            hk = HaiKangSDK(ip, secret)
            hk.getPersonGroup()
            data  = hk.getAllCamera()
            Camera.objects.update(onLineStatus=0)
            for each in data['data']['list']:
                c = Camera.objects.filter(cameraUuid=each['cameraUuid'])
                n = Camera.objects.filter(code=each['cameraName'])
                if n:
                    first = n[0]
                    first.addr = aes.encrypt('http://192.168.5.252:6713/mag/hls/%s/1/live.m3u8'%(each['cameraUuid']))
                    first.cameraUuid = each['cameraUuid']
                    first.onLineStatus =each['onLineStatus']
                    first.save()
                elif c:
                    first = c[0]
                    first.code = each['cameraName']
                    first.name = each['cameraName']
                    first.onLineStatus =each['onLineStatus']
                    first.save()
                else:
                    addr = aes.encrypt('http://192.168.5.252:6713/mag/hls/%s/1/live.m3u8'%(each['cameraUuid']))
                    Camera.objects.create(addr=addr,code=each['cameraName'],name=each['cameraName'],
                            onLineStatus=each['onLineStatus'],cameraUuid=each['cameraUuid'])
            return returnSucc(None)
        except:
            traceback.print_exc()
            return returnError(None)

def tongbuCamera(request):
    try:
        secret = '9a7808bec80d4211b5fd7097750e3450'
        ip = '192.168.5.252'
        hk = HaiKangSDK(ip, secret)
        data  = hk.getAllCamera()
        for each in data['data']['list']:
            c = Camera.objects.filter(cameraUuid=each['cameraUuid'])
            n = Camera.objects.filter(name=each['cameraName'])
            if n:
                first = n[0]
                first.addr = aes.encrypt('http://192.168.5.252:6713/mag/hls/%s/1/live.m3u8'%(each['cameraUuid']))
                first.cameraUuid = each['cameraUuid']
                first.onLineStatus =each['onLineStatus']
                first.save()
            elif c:
                first = c[0]
                first.code = each['cameraName']
                first.name = each['cameraName']
                first.onLineStatus =each['onLineStatus']
                first.save()
            else:
                addr = aes.encrypt('http://192.168.5.252:6713/mag/hls/%s/1/live.m3u8'%(each['cameraUuid']))
                Camera.objects.create(addr=addr,code=each['cameraName'],
                        onLineStatus=each['onLineStatus'],cameraUuid=each['cameraUuid'])
        return returnSucc(None)
    except:
        traceback.print_exc()
        return returnError(None)

@csrf_exempt
# @login_required(login_url="/login/")
def renliu(request):
    if request=='fgf' or request.META["HTTP_HOST"]=='nginx-host':
        try:
            secret = '9a7808bec80d4211b5fd7097750e3450'
            ip = '192.168.5.252'
            hk = HaiKangSDK(ip, secret)
            data  = hk.getPeople()
            return returnSucc(None)
        except:
            traceback.print_exc()
            return returnError(None)

@csrf_exempt
# @login_required(login_url="/login/")
def cheliu(request):
    if request=='fgf' or request.META["HTTP_HOST"]=='nginx-host':
        try:
            secret = '9a7808bec80d4211b5fd7097750e3450'
            ip = '192.168.5.252'
            hk = HaiKangSDK(ip, secret)
            indata  = hk.getCarIn()
            outdata = hk.getCarOut()
            return returnSucc(None)
        except:
            traceback.print_exc()
            return returnError(None)

