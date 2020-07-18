import sys
import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import getpass
from selenium.webdriver.firefox.options import Options
import json
options=Options()

a={
	"nodes": [],
	"links1": [],
	"links2": []
}
profile = webdriver.FirefoxProfile()
driver = webdriver.Firefox(firefox_profile=profile,options=options)
driver.get("file:///home/daksh0225/COVID19-India%20%20%20Patient%20Database%20(https%20_t.me_covid19indiaops)%20-%20Google%20Drive.html")
elem=driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr[3]/td[1]")
cf = []
for i in range(3, 10000):
	if driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[10]").text != "":
		pno = driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[1]").text
		status = driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[10]").text
		contracted_from = driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[12]").text
		print(pno)
		if contracted_from != "" and "E" not in contracted_from:
			cc = contracted_from.split(",")
			for j in cc:
				cf.append(j.strip())

for i in range(3, 10000):
	if driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[10]").text != "":
		pno = driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[1]").text
		status = driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[10]").text
		contracted_from = driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[12]").text
		if (contracted_from != "" and "E" not in contracted_from) or ("P"+str(pno) in cf):
			print(pno)
			a["nodes"].append({"pno": "P"+str(pno), "status": status})
			if (contracted_from != "" and "E" not in contracted_from):
				cc = contracted_from.split(",")
				for j in cc:
					# cf.append(j.strip())
					a["links1"].append({"source": j.strip(), "target": "P"+str(pno)})
		# print(driver.find_element_by_xpath("/html/body/div[2]/div[1]/div/table/tbody/tr["+str(i)+"]/td[1]").text)
driver.close()
json_object = json.dumps(a, indent=2)
with open("Covid_10000.json", "w") as out:
	out.write(json_object)
