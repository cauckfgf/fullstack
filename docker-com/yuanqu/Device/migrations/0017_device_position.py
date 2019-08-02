# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-08-02 08:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0016_device2device_show_direction'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='position',
            field=models.CharField(choices=[('top', 'top'), ('left', 'left'), ('right', 'right'), ('bottom', 'bottom'), ('inside', 'inside'), ('insideLeft', 'insideLeft'), ('insideRight', 'insideRight'), ('insideTop', 'insideTop'), ('insideBottom', 'insideBottom'), ('insideTopLeft', 'insideTopLeft'), ('insideBottomLeft', 'insideBottomLeft'), ('insideTopRight', 'insideTopRight'), ('insideBottomRight', 'insideBottomRight')], default='bottom', max_length=96, verbose_name='\u8bbe\u5907\u6587\u5b57\u4f4d\u7f6e'),
        ),
    ]
