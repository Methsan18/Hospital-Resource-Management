import os
import pickle
import pandas as pd
from flask import Blueprint, request, jsonify
from datetime import datetime
import certifi
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# ==================== MONGODB CONNECTION ====================
MONGO_URI = "mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/test?appName=ITPM"

print("⏳ Connecting to MongoDB...")
try:
    # Connect to MongoDB with SSL certificate verification
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    
    # Test the connection
    client.admin.command('ping')
    print("✅ MongoDB Connection Successful")
    
    # Get database reference
    db = client["Research"]
    
    # Create collections if they don't exist
    collections_to_create = {
        "Illness_Predictions": [
            ("disease", "text"),
            ("predicted_patients", "number"),
            ("scale", "text"),
            ("month", "number"),
            ("week_of_month", "number"),
            ("timestamp", "date")
        ],
        "Illness_Inputs": [
            ("date", "date"),
            ("disease", "text"),
            ("severity", "text"),
            ("cases", "number"),
            ("department", "text"),
            ("ageGroup", "text"),
            ("granularity", "text"),
            ("timestamp", "date")
        ],
        "Bed_Management": [
            ("bed_id", "text"),
            ("status", "text"),
            ("patient_count", "number"),
            ("capacity", "number"),
            ("last_updated", "date")
        ],
        "Hospital_Analytics": [
            ("metric_name", "text"),
            ("value", "number"),
            ("date", "date"),
            ("department", "text")
        ]
    }
    
    for collection_name in collections_to_create.keys():
        if collection_name not in db.list_collection_names():
            db.create_collection(collection_name)
            print(f"   ✅ Collection '{collection_name}' created")
        else:
            print(f"   ✓ Collection '{collection_name}' already exists")
    
    print("="*50)
    
except ConnectionFailure as e:
    print(f"❌ MongoDB Connection Failed: {e}")
    db = None
except Exception as e:
    print(f"❌ Error setting up MongoDB: {e}")
    db = None

# --- 1. DEFINE THE BLUEPRINT FIRST ---
# This fixes the NameError
illness_bp = Blueprint('illness_bp', __name__)

# Disease name mapping (Frontend name -> Model filename)
DISEASE_MAPPING = {
    'Dengue': 'Dengue',
    'Viral Fever': 'Viral_Fever',
    'Respiratory Infection': 'Respiratory_Infection',
    'Common Cold': 'Common_Cold',
    'Gastritis': 'Gastritis',
    'Migraine': 'Migraine',
    'Diabetes': 'Diabetes',
    'Leptospirosis': 'Leptospirosis_(Rat_Fever)',
    'Dysentery': 'Dysentery',
    'Typhoid': 'Typhoid',
    'Chickenpox': 'Chickenpox'
}

# --- 2. SET UP THE PATHS ---
# This finds the 'models' folder inside your 'illness' directory
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')

@illness_bp.route('/predict_illness', methods=['POST'])
def predict():
    try:
        content = request.json
        if not content:
            return jsonify({'status': 'error', 'message': 'No input data provided'}), 400

        disease_name = content.get('disease', 'Dengue')
        # Map frontend disease name to model filename
        disease_model_name = DISEASE_MAPPING.get(disease_name, disease_name.replace(' ', '_'))
        
        scale = content.get('scale', 'weekly').lower() 

        # --- 3. DYNAMIC FOLDER SWITCHING ---
        if scale == 'monthly':
            # Looking for: illness/models/monthly/Dengue_monthly_rf_model.pkl
            model_filename = f"{disease_model_name}_monthly_rf_model.pkl"
            model_path = os.path.join(MODEL_DIR, 'monthly', model_filename)
        else:
            # Looking for: illness/models/Dengue_rf_model.pkl
            model_filename = f"{disease_model_name}_rf_model.pkl"
            model_path = os.path.join(MODEL_DIR, model_filename)
        
        # Log to your server terminal so you can see it working
        print(f"📂 LOADING MODEL: {model_path}")

        if not os.path.exists(model_path):
            return jsonify({
                'status': 'error', 
                'message': f'Model file not found at {model_path}'
            }), 404

        # --- 4. LOAD AND PREDICT ---

        with open(model_path, 'rb') as f:
            model = pickle.load(f)
            
        input_data = pd.DataFrame([{
            'Rainfall_mm': float(content['rainfall']),
            'Humidity_%': float(content['humidity']),
            'Temp_Max': float(content['temp']),
            'Rain_Lag_14_Days': float(content['rain_lag']),
            'Month': int(content['month'])
        }])

        prediction = model.predict(input_data)

        # Calculate week of month
        today = datetime.now()
        first_day = datetime(today.year, today.month, 1)
        past_days = today.day - 1
        week_of_month = (past_days + first_day.weekday()) // 7 + 1

        prediction_value = int(round(float(prediction[0])))
        
        # Save prediction to MongoDB
        if db is not None:
            try:
                prediction_doc = {
                    'disease': content['disease'],
                    'predicted_patients': prediction_value,
                    'scale': scale,
                    'month': int(content['month']),
                    'week_of_month': week_of_month,
                    'timestamp': datetime.now()
                }
                db['Illness_Predictions'].insert_one(prediction_doc)
                print(f"✅ Saved to MongoDB: {content['disease']} - {prediction_value} cases")
            except Exception as e:
                print(f"⚠️ MongoDB insert error: {e}")

        return jsonify({
            'status': 'success',
            'disease': content['disease'],
            'scale': scale,
            'predicted_patients': prediction_value,
            'week_of_month': week_of_month,
            'timeframe': f"Estimated admissions for Week {week_of_month} of {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][int(content.get('month', 1)) - 1]} 2026 (based on weather & historical patterns)",
            'forecast_period': 'monthly'
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400


# ==================== ENDPOINT 3: GET WEATHER DATA ====================
@illness_bp.route('/get_weather', methods=['GET'])
def get_weather():
    """
    Return current and forecasted weather data for the hospital location (Kandy District, Sri Lanka)
    This data is used for disease prediction models
    """
    try:
        from datetime import datetime, timedelta
        
        today = datetime.now()
        
        # Sample weather data for Kandy District, Sri Lanka (monthly average)
        # Based on historical climate patterns
        monthly_weather = {
            1: {'temp': 28.5, 'humidity': 75, 'rainfall': 45, 'rain_lag': 50},  # January
            2: {'temp': 29.2, 'humidity': 73, 'rainfall': 35, 'rain_lag': 40},  # February
            3: {'temp': 30.5, 'humidity': 82, 'rainfall': 65, 'rain_lag': 35},  # March
            4: {'temp': 31.2, 'humidity': 85, 'rainfall': 150, 'rain_lag': 65}, # April
            5: {'temp': 30.1, 'humidity': 84, 'rainfall': 155, 'rain_lag': 150}, # May
            6: {'temp': 28.9, 'humidity': 81, 'rainfall': 112, 'rain_lag': 155}, # June
            7: {'temp': 28.3, 'humidity': 80, 'rainfall': 120, 'rain_lag': 112}, # July
            8: {'temp': 28.7, 'humidity': 81, 'rainfall': 130, 'rain_lag': 120}, # August
            9: {'temp': 29.2, 'humidity': 83, 'rainfall': 145, 'rain_lag': 130}, # September
            10: {'temp': 29.5, 'humidity': 85, 'rainfall': 135, 'rain_lag': 145}, # October
            11: {'temp': 28.8, 'humidity': 82, 'rainfall': 95, 'rain_lag': 135},  # November
            12: {'temp': 27.9, 'humidity': 76, 'rainfall': 55, 'rain_lag': 95}   # December
        }
        
        current_month = today.month
        current_weather = monthly_weather.get(current_month, {
            'temp': 29.5,
            'humidity': 80,
            'rainfall': 100,
            'rain_lag': 90
        })
        
        # Calculate trend (simple: compare to last month)
        prev_month = current_month - 1 if current_month > 1 else 12
        prev_weather = monthly_weather.get(prev_month, current_weather)
        
        temp_change = current_weather['temp'] - prev_weather['temp']
        temp_trend = "↑" if temp_change > 0 else "↓" if temp_change < 0 else "→"
        
        return jsonify({
            'status': 'success',
            'location': 'Kandy District, Sri Lanka',
            'date': today.strftime('%Y-%m-%d'),
            'current': {
                'temperature': current_weather['temp'],
                'temperature_unit': '°C',
                'humidity': current_weather['humidity'],
                'humidity_unit': '%',
                'rainfall': current_weather['rainfall'],
                'rainfall_unit': 'mm',
                'rain_lag': current_weather['rain_lag'],
                'rain_lag_unit': 'mm',
                'temperature_trend': f"{temp_trend} {abs(temp_change):.1f}°C from last month",
                'rainfall_status': "Heavy" if current_weather['rainfall'] > 120 else "Moderate" if current_weather['rainfall'] > 60 else "Light"
            },
            'forecast': {
                'next_month': {
                    'month_num': (current_month % 12) + 1,
                    'temperature': monthly_weather.get((current_month % 12) + 1, current_weather)['temp'],
                    'humidity': monthly_weather.get((current_month % 12) + 1, current_weather)['humidity'],
                    'rainfall': monthly_weather.get((current_month % 12) + 1, current_weather)['rainfall']
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400
    """
    Save manual illness input data to MongoDB Illness_Inputs collection
    Used by TrainModel.jsx to feed new records into the system
    """
    try:
        content = request.json
        if not content:
            return jsonify({'status': 'error', 'message': 'No input data provided'}), 400

        # Validate required fields
        required_fields = ['date', 'disease', 'cases']
        for field in required_fields:
            if field not in content or content[field] == '':
                return jsonify({'status': 'error', 'message': f'Missing required field: {field}'}), 400

        # Create document to save
        illness_input_doc = {
            'date': content.get('date'),
            'disease': content.get('disease'),
            'severity': content.get('severity', 'Medium'),
            'cases': int(content.get('cases', 0)),
            'department': content.get('department', 'OPD'),
            'ageGroup': content.get('ageGroup', 'All Ages'),
            'granularity': content.get('granularity', 'Weekly'),
            'timestamp': datetime.now()
        }

        # Save to MongoDB if connected
        if db is not None:
            try:
                result = db['Illness_Inputs'].insert_one(illness_input_doc)
                record_id = str(result.inserted_id)
                print(f"✅ Saved to Illness_Inputs: {content['disease']} - {content['cases']} cases (ID: {record_id})")
                
                return jsonify({
                    'status': 'success',
                    'message': 'Record saved to database',
                    'record_id': record_id,
                    'disease': content['disease'],
                    'cases': int(content['cases'])
                }), 201
            except Exception as e:
                print(f"❌ MongoDB insert error: {e}")
                return jsonify({'status': 'error', 'message': f'Database save failed: {str(e)}'}), 500
        else:
            return jsonify({'status': 'error', 'message': 'MongoDB not connected'}), 500

    except ValueError as e:
        return jsonify({'status': 'error', 'message': f'Invalid data format: {str(e)}'}), 400