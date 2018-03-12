# -*- coding: utf-8 -*-
from django.db import models
from django import core
# Create your models here.

import time, hashlib, json

'''
block = {
    'index': 1,#索引
    'timestamp': 1506057125.900785,#时间戳
    'transactions': [#交易列表
        {
            'sender': "8527147fe1f5426f9dd545de4b27ee00",
            'recipient': "a77f5cdfa2934df3954a5c7c7da5df1f",
            'amount': 5,
        }
    ],
    'proof': 324984774000,#工作量证明
    'previous_hash': "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"#区块的Hash值
}
'''

class Transactions(models.Model):
    """交易列表"""
    sender = models.CharField(max_length=64, verbose_name='发送人')
    recipient = models.CharField(max_length=64, verbose_name='接收人')
    amount = models.IntegerField(default=0)

class Block(models.Model):
    """块"""
    # index = id
    time = models.DateTimeField(auto_now=True)
    proof = models.CharField(max_length=64, verbose_name='工作量证明')
    previous_hash = models.CharField(max_length=128, verbose_name='区块的Hash值')
    transactions = models.ManyToManyField(Transactions,null=True,blank=True,related_name="Block")

    def save(self, *args, **kwargs):
        try:
            latest = Block.objects.latest('id')
        except:
            latest = Block.objects.create(proof='root',previous_hash='root')
        self.previous_hash = latest.hash()

        if self.valid_proof(latest.proof, self.proof):
            return super(Block,self).save(*args, **kwargs)
        else:
            raise core.exceptions.SuspiciousOperation(u'工作量无效')

    def tojson(self):
        return eval(core.serializers.serialize('json',[self])[1:-1])

    def hash(self):
        # 生成块的 SHA-256 hash值
        # :param block: <dict> Block
        # :return: <str>
        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(self.tojson(), sort_keys=True).encode()
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
        # return True
        # 验证证明: 是否hash(last_proof, proof)以4个0开头?
        # :param last_proof: <int> Previous Proof
        # :param proof: <int> Current Proof
        # :return: <bool> True if correct, False if not.
        # guess = f'{last_proof}{proof}'.encode()
        # guess = ('%s%s'%(last_proof,proof)).encode()
        # guess_hash = hashlib.sha256(guess).hexdigest()
        # return guess_hash[:4] == "0000"
       return ((int(last_proof)+int(proof))/2)%3==0 and proof > last_proof

class Blockchain(object):
    """docstring for """
    def __init__(self):
        self.chain = []
        self.current_transactions = []

    def new_block(self, proof, previous_hash=None):
        """
        生成新块
        :param proof: <int> The proof given by the Proof of Work algorithm
        :param previous_hash: (Optional) <str> Hash of previous Block
        :return: <dict> New Block
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time.time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        self.chain.append(block)
        self.current_transactions = []
        return block

    def new_transaction(self,sender, recipient, amount):
        # 生成新交易信息，信息将加入到下一个待挖的区块中
        # :param sender: <str> Address of the Sender
        # :param recipient: <str> Address of the Recipient
        # :param amount: <int> Amount
        # :return: <int> The index of the Block that will hold this transaction
        self.current_transactions.append({
            'sender':sender,
            'recipient':recipient,
            'amount':amount
        })
        return self.last_block()['index']+1

    @staticmethod
    def hash(block):
        # 生成块的 SHA-256 hash值
        # :param block: <dict> Block
        # :return: <str>
        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        # Returns the last Block in the chain
        return self.chain[-1]

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