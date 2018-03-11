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
    '''区块链'''
    id = serializers.ReadOnlyField()
    previous_hash = serializers.ReadOnlyField()

    @staticmethod
    def hash(block):
        # 生成块的 SHA-256 hash值
        # :param block: <dict> Block
        # :return: <str>
        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof):
        """
        简单的工作量证明:
         - 查找一个 p' 使得 hash(pp') 以4个0开头
         - p 是上一个块的证明,  p' 是当前的证明
        :param last_proof: <int>
        :return: <int>
        """
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        # 验证证明: 是否hash(last_proof, proof)以4个0开头?
        # :param last_proof: <int> Previous Proof
        # :param proof: <int> Current Proof
        # :return: <bool> True if correct, False if not.
        # guess = f'{last_proof}{proof}'.encode()
        guess = '%d%d'%(last_proof,proof).encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    class Meta:
        model = Block
        fields = '__all__'