import pandas as pd
import json
import numpy as np

with open("trade_balance_by_country.json") as tb:
	data = json.load(tb)

categories = ["name", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
iport = pd.read_csv("line_import.csv", usecols=categories, encoding='latin-1')
export = pd.read_csv("line_export.csv", usecols=categories, encoding='latin-1')

label = iport["name"]

iport = pd.read_csv("line_import.csv", index_col="name", encoding="latin-1")
export = pd.read_csv("line_export.csv", index_col="name", encoding="latin-1")
for i in range(len(label)):
	d={
		"label": label[i],
	}
	cnt=0
	for j in range(0,19):
		d["import"+categories[j+1]] = iport.loc[label[i]][j]

	for j in range(0,19):
		d["export"+categories[j+1]] = export.loc[label[i]][j]

	print(d)
	data["children"].append(d)

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

with open("trade_balance_by_country.json", "w") as out:
	json.dump(data, out, indent=4, cls=NpEncoder)