# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
import os
import urllib
import time
driver = webdriver.PhantomJS()

def onepage(url="https://login.taobao.com/member/login.jhtml?style=mini&from=alimama"):
    driver.get(url)
    u = driver.find_element_by_id("TPL_username_1")
    u.clear()
    u.send_keys('cauckfgf')
    time.sleep(1)
    p = driver.find_element_by_id("TPL_password_1")
    p.clear()
    p.send_keys('fgf13439995837')

    

    source = driver.find_element_by_id("nc_1_n1z")
    ActionChains(driver).drag_and_drop_by_offset(source,250,0).perform()
    time.sleep(2)

    driver.find_element_by_id("J_SubmitStatic").click()
    dr = WebDriverWait(driver,5)
    driver.save_screenshot('screen_shoot.png') 





onepage()