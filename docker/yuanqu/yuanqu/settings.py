# -*- coding: utf-8 -*-
"""
Django settings for yuanqu project.

Generated by 'django-admin startproject' using Django 1.9.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '2al!@e2*r(bwexb^+ng@o_go5fd=+3&9vw3sy4ndt@=vw749=d'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_filters',
    'rest_framework',
    'Device',
    'SystemManage',
    # 'social_django'
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticatedOrReadOnly',),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',

    ),
    'DEFAULT_PAGINATION_CLASS': 'yuanqu.pagination.GlobalPageNumberPagination',
    'PAGE_SIZE': 1000
}
MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'yuanqu.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(os.path.split( os.path.dirname(__file__))[0],'templates').replace('\\','/'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # 'social_django.context_processors.backends',
                # 'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'yuanqu.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases



DATABASES = {
        'auth': {
            'ENGINE': 'django.db.backends.mysql',
            #'NAME': 'scc4pms',
            # 'NAME': 'xhyyfm',

            'NAME': 'yuanqu',
            'USER':'zzkj',
            'PASSWORD':'zzkjyunwei123456',
            'HOST':'180.167.191.174',
            'PORT':3306,
        },
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            #'NAME': 'scc4pms',
            # 'NAME': 'xhyyfm',

            'NAME': 'yuanqu',
            'USER':'zzkj',
            'PASSWORD':'zzkjyunwei123456',
            'HOST':'180.167.191.174',
            'PORT':3306,
        },
        'slave': {
            'ENGINE': 'django.db.backends.mysql',
            #'NAME': 'scc4pms',
            # 'NAME': 'xhyyfm',

            'NAME': 'yuanqu',
            'USER':'zzkj',
            'PASSWORD':'zzkjyunwei123456',
            'HOST':'180.167.191.174',
            'PORT':3306,
        },


}


# DATABASES = {
#         'default': {
#             'ENGINE': 'django.db.backends.mysql',
#             #'NAME': 'scc4pms',
#             # 'NAME': 'xhyyfm',

#             'NAME': 'yuanqu',
#             'USER':'root',
#             'PASSWORD':'zzkjyunwei',
#             'HOST':'116.62.228.242',
#             'PORT':3306,
#         },


# }
# DATABASE_ROUTERS = ['yuanqu.dbrouter.Router',]  
# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

# USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = (
    ("css",os.path.join(STATIC_ROOT, 'css')),
    ("js",os.path.join(STATIC_ROOT, 'js')),
    ("image",os.path.join(STATIC_ROOT, 'image')),
)

MEDIA_URL='/media/'
MEDIA_ROOT=os.path.join(BASE_DIR,'media').replace("\\","/")
STATIC_PATH=STATIC_ROOT

AppID = 'wx5e36e6d9e9c8c6f3'
AppSecret = '12f0e0bb748a1fb1ce4680f24ebd6d99'
Token = 'fgf1987'
SOCIAL_AUTH_WEIXIN_KEY = AppID
SOCIAL_AUTH_WEIXIN_SECRET = AppSecret

# SOCIAL_AUTH_PIPELINE = (
#     'social.pipeline.social_auth.social_details',
#     'social.pipeline.social_auth.social_uid',
#     'social.pipeline.social_auth.auth_allowed',
#     'social_auth.backends.pipeline.social.social_auth_user',
#     # 用户名与邮箱关联，文档说可能出现问题
#     # 'social_auth.backends.pipeline.associate.associate_by_email',
#     'social_auth.backends.pipeline.misc.save_status_to_session',
#     'social_auth.backends.pipeline.user.create_user',
#     'social_auth.backends.pipeline.social.associate_user',
#     'social_auth.backends.pipeline.social.load_extra_data',
#     'social_auth.backends.pipeline.user.update_user_details',
#     'social_auth.backends.pipeline.misc.save_status_to_session',

# )
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'yuanqu.wechatAuth.WechatOpenidAuth',
)
# SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/' 