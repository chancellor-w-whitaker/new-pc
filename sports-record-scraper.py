import json
import requests
from bs4 import BeautifulSoup


sports = [
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
    "cross-country",
]


def get_record(sport):
    request = requests.get(f"https://ekusports.com/sports/{sport}/schedule")

    soup = BeautifulSoup(request.content, "html.parser")

    title = soup.find("div", class_="sidearm-schedule-title")

    header_string = title.find("h2").string

    if sport == "cross-country":

        my_dict = dict()

        my_dict["Title"] = header_string

        return my_dict

    record = soup.find("div", class_="sidearm-schedule-record")

    items = record.find_all("li")

    spans = list(map(lambda li: li.find_all("span"), items))

    for index in range(len(spans)):

        stat = list(map(lambda span: span.string, spans[index]))

        spans[index] = stat

    my_dict = dict(spans)

    my_dict["Title"] = header_string

    return my_dict


all_records = list(map(lambda sport: get_record(sport), sports))


print(all_records)


with open("data.json", "w") as f:
    json.dump(all_records, f, indent=4)  # indent for pretty formatting
