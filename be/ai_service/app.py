import os
import importlib.util

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    # Try package import first
    from Bed.bed_logic import app
except Exception:
    # Fallback: load by file path (works regardless of CWD)
    bed_file = os.path.join(BASE_DIR, 'Bed', 'bed_logic.py')
    alt_file = os.path.join(BASE_DIR, 'bed_logic.py')

    if os.path.exists(bed_file):
        spec = importlib.util.spec_from_file_location('bed_logic', bed_file)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        app = module.app
    elif os.path.exists(alt_file):
        spec = importlib.util.spec_from_file_location('bed_logic', alt_file)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        app = module.app
    else:
        raise ImportError("Could not locate 'bed_logic' module (tried Bed/bed_logic.py and bed_logic.py)")

if __name__ == '__main__':
    print("🚀 Initializing Hospital AI System via app.py...")
    print("📈 Starting Flask server on Port 5001...")
    app.run(debug=True, port=5001, host='0.0.0.0')