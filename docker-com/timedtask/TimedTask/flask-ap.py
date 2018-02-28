#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Mon Apr 17 22:27:34 2017

@author: bladestone
"""
from flask_apscheduler import APScheduler
from flask import Flask
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
import time,json
import urllib2
from flask import request
import traceback
import logging
logging.basicConfig()
scheduler=None

class Config(object):
    # JOBS = [
    #         {
    #            'id':'job1',
    #            'func':'flask-ap:test_data',
    #            'args': 'x',
    #            'trigger': {
    #                 'type': 'cron',
    #                 'day_of_week':"mon-fri",
    #                 'hour':'0-23',
    #                 'minute':'0-59',
    #                 'second': '*/5'
    #             }

    #          }
    #     ]
    SCHEDULER_API_ENABLED = True
    SCHEDULER_JOBSTORES = {
        'default': SQLAlchemyJobStore(url='sqlite:////var/www/jobs.sqlite')
    }

app = Flask(__name__, static_url_path='')

def get(URL):
    response = urllib2.urlopen(URL) #调用urllib2向服务器发送get请求
    return json.loads(response.read()) #获取服务器返回的页面信息

def post(URL,values):
    headers = {'Content-Type': 'application/json'}
    data = json.dumps(values)    #适用urllib对数据进行格式化编码
    req = urllib2.Request(url=URL, headers=headers, data=data)    #生成页面请求的完整数据
    response = urllib2.urlopen(req)     #发送页面请求
    return json.loads(response.read())    #获取服务器返回的页面信息
def task(d):
    print("work param:",d)
    r = get(d)
    print("work res:",r)

def jobfromparm(**jobargs):
    id = str(time.time())
    print('add job: ',id)
    job = scheduler.add_job(func=task,id=id, **jobargs)
    return 'sucess'

@app.route('/pause')
def pausejob():
    scheduler.pause_job('job1')
    return "Success!"


@app.route('/resume')
def resumejob():
    scheduler.resume_job('job1')
    return "Success!"

@app.route('/job', methods=['GET', 'POST'])
def job():
    try:
        if request.method=='POST':
            data = request.get_json(force=True)
            job = jobfromparm(**data)
            return json.dumps({'res':'sucess'})
        elif request.method=='GET':
            res = {'res':[]}
            for job in scheduler.get_jobs():
                t = {}
                t['id'] = job.id
                t['args'] = job.args
                t['trigger'] = str(job.trigger)
                res['res'].append(t)
            return json.dumps(res)
    except:
        traceback.print_exc()

@app.route('/job/<id>', methods=['GET', 'PUT', 'DELETE'])
def job_id(id):
    if request.method=='PUT':
        pass
        return 'sucess'
    elif request.method=='DELETE':
        scheduler.delete_job(id)
        return json.dumps({'res':'sucess'})
    elif request.method=='GET':
        job = scheduler.get_job(id)
        res = {'id':job.id,'args':job.args}
        return json.dumps(res)

if __name__ == '__main__':
    scheduler = APScheduler()
    print("Let us run out of the loop")
    app.config.from_object(Config())

    # it is also possible to enable the API directly
    # scheduler.api_enabled = True
    scheduler.init_app(app)
    scheduler.start()
    # scheduler.add_job('job3', test_data,trigger='cron',second='*/5',args=['z'])
    app.run(host='0.0.0.0',debug=True,threaded=False)
