# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2019-07-10 06:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Device', '0012_auto_20190710_0921'),
    ]

    operations = [
        migrations.AddField(
            model_name='devicetype',
            name='gif',
            field=models.FileField(blank=True, null=True, upload_to='upload/', verbose_name='\u8bbe\u5907\u52a8\u6001\u56fe'),
        ),
    ]