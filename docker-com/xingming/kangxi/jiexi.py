# -*- coding: utf-8 -*-
from kangxi.models import Hanzi,  Wuge
import codecs
def wenzi():
	shuxing={
	     "j":u"【金】",
	     "m":u"【木】",
	     "s":u"【水】",
	     "h":u"【火】",
	     "t":u"【土】",
	}
	f=codecs.open("./kangxi.txt",'r',"utf-8")
	lines = f.readlines()
	bihua=0
	data = {}
	for l in lines:
	    if l.startswith(u"笔画数为"):
	        bihua = int(l.split(u"的")[0].replace(u"笔画数为",""))
	    elif l.startswith(shuxing.get('j')):
	    	for z in l.replace(shuxing.get('j'),""):
	    		print z
	    		Hanzi.objects.create(wuxing=1,bihua=bihua,zi=z)
	    elif l.startswith(shuxing.get('m')):
	    	for z in l.replace(shuxing.get('m'),""):
	    		print z
	    		Hanzi.objects.create(wuxing=2,bihua=bihua,zi=z)
	    elif l.startswith(shuxing.get('s')):
	    	for z in l.replace(shuxing.get('s'),""):
	    		print z
	    		Hanzi.objects.create(wuxing=3,bihua=bihua,zi=z)
	    elif l.startswith(shuxing.get('h')):
	    	for z in l.replace(shuxing.get('h'),""):
	    		print z
	    		Hanzi.objects.create(wuxing=4,bihua=bihua,zi=z)
	    elif l.startswith(shuxing.get('t')):
	    	for z in l.replace(shuxing.get('t'),""):
	    		print z
	    		Hanzi.objects.create(wuxing=5,bihua=bihua,zi=z)

def jwuge():
	f=codecs.open("./wuge.txt",'r',"utf-8")
	lines = f.readlines()
	for l in lines:
		try:
			n = int(l[:2])
			s = 2
		except:
			try:
				n = int(l[0])
				s = 1
			except:
				continue
		if u"大吉" in l:
			jx = u"大吉"
			jx_index = 1
		elif u"半吉" in l:
			jx = u"凶"
			jx_index = 3
		elif u"大凶" in l:
			jx = u"大凶"
			jx_index = 4
		elif u"凶" in  l:
			jx = u"凶"
			jx_index = 3
		elif u"吉" in l:
			jx = u"吉"
			jx_index = 2
		Wuge.objects.create(number=n,txt=l[s:],jx=jx,jx_index=jx_index)

jwuge()