# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-09-19 03:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0021_auto_20190807_1225'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='tuya_code',
            field=models.CharField(blank=True, default='', max_length=96, verbose_name='\u6d82\u9e26\u8bbe\u5907code'),
        ),
        migrations.AlterField(
            model_name='device2device',
            name='connection',
            field=models.CharField(default='green', max_length=96, verbose_name='\u7ebf\u989c\u8272'),
        ),
    ]
