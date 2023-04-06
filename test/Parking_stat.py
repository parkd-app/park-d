def commit_analytics_change(result):
    current_time = datetime.datetime.now()
    # format the time in am/pm format
    time_in_ampm_format = current_time.strftime("%I%p")
    hour_data = {
        "hour": time_in_ampm_format,
        "occupancy": {
            "acc": [], #1
            "res": [], #2
            "std":[] #0
        }
    }
    for parking_lot in result["parking_spaces"]:
        types_enum = parking_lot["type"]
        stats = parking_lot["status"]
        if types_enum == 0:
            hour_data["occupancy"]["std"].append(stats)
        elif types_enum == 1:
            hour_data["occupancy"]["acc"].append(stats)
        else:
            hour_data["occupancy"]["res"].append(stats)

    analytics = query_by_key("analytics")
    analytics["data"]["occupancy"].append(hour_data)
    set_by_key("analytics", analytics)


def test_data():
    data = {
  "data": {
    "id": 1,
    "location": {
      "address": "1151-1277 W Center St, Cedar City, UT 84720, United States",
      "name": "1151-1277 W Center St Parking"
    },
    "occupancy": [
      {
        "hour": "12am",
        "occupancy": {
          "acc": [
            false,
            false,
            false,
            false
          ],
          "res": [
            false,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "1am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "2am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "3am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "4am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "5am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true
          ]
        }
      },
      {
        "hour": "6am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true
          ]
        }
      },
      {
        "hour": "7am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "8am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "9am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "10am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            true,
            true,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "11am",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "12pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
          ]
        }
      },
      {
        "hour": "1pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            true,
            true,
            true
          ]
        }
      },
      {
        "hour": "2pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "3pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            true,
            true,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "4pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "5pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            true,
            true,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "6pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "7pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "8pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      },
      {
        "hour": "9pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "10pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true
          ]
        }
      },
      {
        "hour": "11pm",
        "occupancy": {
          "acc": [
            true,
            false,
            false,
            false
          ],
          "res": [
            true,
            false,
            false,
            false,
            false,
            false
          ],
          "std": [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ]
        }
      }
    ]
  }
}
    return data