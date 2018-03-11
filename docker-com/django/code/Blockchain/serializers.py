# -*- coding: utf-8 -*-
import hashlib, json
from rest_framework import serializers
from .models import *

class TransactionsSerializer(serializers.HyperlinkedModelSerializer):
    """交易列表"""
    id = serializers.ReadOnlyField()
    class Meta:
        model = Transactions
        fields = '__all__'

class BlockSerializer(serializers.HyperlinkedModelSerializer):
    '''监测报警'''
    id = serializers.ReadOnlyField()

    def create(self, validated_data):
        validated_data['previous_hash'] = self.hash(Block.objects.lastest())
        block = Block.objects.create(**validated_data)
        return block

    @staticmethod
    def hash(block):
        # 生成块的 SHA-256 hash值
        # :param block: <dict> Block
        # :return: <str>
        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()
    class Meta:
        model = Block
        fields = '__all__'