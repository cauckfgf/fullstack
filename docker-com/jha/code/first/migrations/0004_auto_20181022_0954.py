# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2018-10-22 01:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('first', '0003_leader_news_other_scope'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='leader',
            options={'verbose_name': '\u9886\u5bfc\u81f4\u8f9e', 'verbose_name_plural': '\u9886\u5bfc\u81f4\u8f9e'},
        ),
        migrations.AlterModelOptions(
            name='news',
            options={'verbose_name': '\u5b9e\u65f6\u65b0\u95fb\u8d44\u8baf', 'verbose_name_plural': '\u5b9e\u65f6\u65b0\u95fb\u8d44\u8baf'},
        ),
        migrations.AlterModelOptions(
            name='scope',
            options={'verbose_name': '\u4e1a\u52a1\u8303\u56f4', 'verbose_name_plural': '\u4e1a\u52a1\u8303\u56f4'},
        ),
        migrations.AlterField(
            model_name='leader',
            name='images',
            field=models.ManyToManyField(to='first.File', verbose_name=b'\xe5\x9b\xbe\xe7\x89\x87'),
        ),
        migrations.AlterField(
            model_name='other',
            name='images',
            field=models.ManyToManyField(to='first.File', verbose_name=b'\xe5\x85\xac\xe5\x8f\xb8\xe7\xae\x80\xe4\xbb\x8b\xe5\x9b\xbe\xe7\x89\x87'),
        ),
    ]