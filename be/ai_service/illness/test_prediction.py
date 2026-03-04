import requests

url = "http://127.0.0.1:5001/predict_illness"
test_data = {
    "disease": "Dengue",
    "rainfall": 15.5,
    "humidity": 80.0,
    "temp": 30.5,
    "rain_lag": 12.0,
    "month": 3
}

try:
    response = requests.post(url, json=test_data)
    print("Status Code:", response.status_code)
    print("Response Data:", response.json())
except Exception as e:
    print("Error:", e)