# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-06-23 10:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0005_auto_20190623_1744'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='status',
            field=models.IntegerField(default=0, verbose_name='\u72b6\u6001'),
        ),
    ]
