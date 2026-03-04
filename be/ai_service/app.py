import os
import importlib.util
from flask import Flask
from flask_cors import CORS

# 1. Initialize the main Flask App
app = Flask(__name__)

# 2. Apply CORS to the ENTIRE app (This allows React to talk to Port 5001)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_module_logic(folder_name, file_name, blueprint_name):
    """Helper function to safely load blueprints dynamically."""
    file_path = os.path.join(BASE_DIR, folder_name, file_name)
    if os.path.exists(file_path):
        try:
            spec = importlib.util.spec_from_file_location(blueprint_name, file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # Check if the module has the Blueprint
            if hasattr(module, blueprint_name):
                blueprint = getattr(module, blueprint_name)
                app.register_blueprint(blueprint)
                print(f"✅ {folder_name.capitalize()} Module loaded successfully.")
                return True
            else:
                print(f"⚠️ {folder_name} file found, but '{blueprint_name}' is missing.")
        except Exception as e:
            print(f"❌ Error loading {folder_name}: {str(e)}")
    else:
        print(f"⚠️ {folder_name} module NOT found at: {file_path}")
    return False

# --- LOAD MODULE 1: BED MANAGEMENT ---
# Looks for 'bed_bp' inside 'Bed/bed_logic.py'
load_module_logic('Bed', 'bed_logic.py', 'bed_bp')

# --- LOAD MODULE 2: ILLNESS PREDICTION ---
# Looks for 'illness_bp' inside 'illness/illness_logic.py'
load_module_logic('illness', 'illness_logic.py', 'illness_bp')

# --- ROOT ROUTE (For Health Check) ---
@app.route('/')
def index():
    return {
        "status": "online",
        "message": "Hospital AI System Backend is Running",
        "modules": ["Bed Management", "Illness Prediction"]
    }

# --- SERVER START ---
if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 INITIALIZING HOSPITAL AI SYSTEM (Beds + Illness)")
    print(f"📍 Base Directory: {BASE_DIR}")
    print("📈 Server running on: http://127.0.0.1:5001")
    print("="*60 + "\n")
    
    # use_reloader=False is CRITICAL for heavy AI models to prevent memory errors
    app.run(debug=True, use_reloader=False, port=5001, host='0.0.0.0')