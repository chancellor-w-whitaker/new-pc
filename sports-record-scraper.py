import json
import requests
from bs4 import BeautifulSoup

sports_with_records = [
    "baseball",
    "mens-basketball",
    "football",
    "mens-golf",
    "mens-tennis",
    "track-and-field",
    "womens-basketball",
    "womens-beach-volleyball",
    "womens-golf",
    "womens-soccer",
    "softball",
    "womens-tennis",
    "womens-volleyball",
]

sports_without_records = ["cross-country"]


def get_record(sport_name):
    r = requests.get(f"https://ekusports.com/sports/{sport_name}/schedule")
    soup = BeautifulSoup(r.content, "html.parser")
    s = soup.find("div", class_="sidearm-schedule-record")
    content = s.find_all("li")
    result = list(map(lambda li: li.find_all("span"), content))
    for i in range(len(result)):
        pair = list(map(lambda span: span.string, result[i]))
        result[i] = pair
    my_dict = dict(result)
    my_dict["Sport"] = sport_name
    return my_dict


all_records = list(map(lambda sport: get_record(sport), sports_with_records))

with open("data.json", "w") as f:
    json.dump(all_records, f, indent=4)  # indent for pretty formatting

print(all_records)


# Double all numbers using map and lambda
# numbers = (1, 2, 3, 4)
# result = map(lambda x: x + x, numbers)
# print(list(result))
