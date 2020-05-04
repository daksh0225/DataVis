import pandas as pd
import json
import numpy as np
import sys
data = {
	"name": sys.argv[1],
	"children": []
}
with open("./datasets/export.json") as file:
	DATA = json.load(file)
categories = ["Product label", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]
file = pd.read_csv(sys.argv[2], usecols = categories, encoding='latin-1')
# print(file["Product label"][1])
# print(categories)
for i in range(0, 19):
	d={
		"name": categories[i+1],
		"children": []
	}
	for j in range(len(file["Product label"])):
		d["children"].append(
			{
				"name": file["Product label"][j],
				"value": file[categories[i+1]][j]
			}
		)
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

# json_object = json.dumps(data, indent=4, cls=NpEncoder)

DATA["children"].append(data)

# print(DATA)

json_object = json.dumps(DATA, indent=4, cls=NpEncoder)
with open("./datasets/export.json", "w") as out:
	json.dump(DATA, out, indent=4, cls=NpEncoder)