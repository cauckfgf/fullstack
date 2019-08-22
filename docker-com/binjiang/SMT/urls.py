# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'cameratype', CameraTypeSet)
router.register(r'camera', CameraSet)
router.register(r'screenshot', ScreenshotSet)
router.register(r'pathseting', PathSetingSet)
router.register(r'alarmtype', AlarmtypeSet)
router.register(r'alarm', AlarmSet)
router.register(r'station', StationSet)
router.register(r'warning', WarningSet)
router.register(r'entranceguard', EntranceguardSet)
router.register(r'entrancecardInfo', EntranceCardInfoSet)
router.register(r'egentrancecontrolvalue', EgentranceControlValueSet)
router.register(r'people', PeopleSet)
router.register(r'peoplebase', PeopleBaseSet)
router.register(r'car',CarSet)
router.register(r'carbase',CarBaseSet)
router.register(r'province',ProvinceSet)
router.register(r'city',CitySet)
router.register(r'person',PersonSet)
router.register(r'persongroup',PersonGroupSet)
router.register(r'personwarn',PersonWarnSet)
router.register(r'carrecord',CarRecordSet)



router.register(r'Lwbhsz', LwbhszSet)
router.register(r'Lwdtjhss', LwdtjhssSet)
router.register(r'Lwdtjhsz', LwdtjhszSet)
router.register(r'Lwdyz', LwdyzSet)
router.register(r'Lwjhkh', LwjhkhSet)
router.register(r'Lwjhsz', LwjhszSet)
router.register(r'Lwjhxl', LwjhxlSet)
router.register(r'Lwlogin', LwloginSet)
router.register(r'Lwmain', LwmainSet)
router.register(r'Lwmaintemp', LwmaintempSet)
router.register(r'Lwnhdd', LwnhddSet)
router.register(r'Lwnhry', LwnhrySet)
router.register(r'Lwsjsz', LwsjszSet)
router.register(r'Lwsys', LwsysSet)
router.register(r'Lwwxjhss', LwwxjhssSet)
router.register(r'Lwwxjhsz', LwwxjhszSet)
router.register(r'Lwxlmc', LwxlmcSet)
router.register(r'Lwxlsz', LwxlszSet)
router.register(r'Lwyxjhss', LwyxjhssSet)
router.register(r'Lwyxjhsz', LwyxjhszSet)
router.register(r'SmtPatrolstick', SmtPatrolstickSet)
router.register(r'SmtPatrolpath', SmtPatrolpathSet)
router.register(r'SmtPatrolposition', SmtPatrolpositionSet)
router.register(r'SmtPatrolrecord', SmtPatrolrecordSet)
router.register(r'SmtPatrolRecord2Position', SmtPatrolRecord2PositionSet)

urlpatterns = [
    url(r'^rest/', include(router.urls)),
    # url(r'^aboutUs/$', aboutUs),
# htmls
    url(r'^main/$', smt),
    url(r'^xungeng/$', xungeng),
    url(r'^warn/$', warn),
    url(r'^camerabyip/$', camerabyip),
    url(r'^entrance/$', entrance),
    url(r'^checkonline/$', checkonline),
    url(r'^renliu/$', renliu),
    url(r'^cheliu/$',cheliu),
]