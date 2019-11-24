"""yuanqu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import RedirectView
from django.conf.urls.static import static
from .views import *
from SystemManage.views import logout
from yuanqu import  settings
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', RedirectView.as_view(url='/index/')),
    url(r'^index/$', index),
    url(r'^wx/', wx),
    url(r'^login/$', login),
    url(r'^logout/', logout),
    url(r'^mobile/', mobile),
    url(r'^home/', home)
    # url('', include('social_django.urls', namespace='social'))
]

urlpatterns += [
    url(r'^device/', include('Device.urls')),
    url(r'^config/', include('SystemManage.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)