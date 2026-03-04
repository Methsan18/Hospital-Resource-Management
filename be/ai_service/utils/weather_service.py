import requests

API_KEY = "YOUR_OPENWEATHER_API_KEY_HERE"
CITY = "Kandy,LK"

def get_kandy_weather():
    url = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
    response = requests.get(url).json()
    
    if response.get("cod") != 200:
        return None

    return {
        "temp": response['main']['temp_max'],
        "humidity": response['main']['humidity'],
        # Note: Rainfall isn't always in the current weather object 
        # unless it is currently raining. We'll default to 0.0 if not found.
        "rainfall": response.get('rain', {}).get('1h', 0.0) 
    }