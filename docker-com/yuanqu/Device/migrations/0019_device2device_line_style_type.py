# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-08-05 01:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0018_auto_20190802_1643'),
    ]

    operations = [
        migrations.AddField(
            model_name='device2device',
            name='line_style_type',
            field=models.CharField(choices=[('solid', '\u5b9e\u7ebf'), ('dashed', '\u957f\u865a\u7ebf'), ('dotted', '\u77ed\u865a\u7ebf')], default='solid', max_length=96, verbose_name='\u7ebf\u7684\u7c7b\u578b'),
        ),
    ]
