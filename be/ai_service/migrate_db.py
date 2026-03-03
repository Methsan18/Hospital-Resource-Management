import pandas as pd
from pymongo import MongoClient
import os
import certifi 

# --- 1. CONFIGURATION ---
MONGO_URI = "mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/?appName=ITPM"

# FIX: Database name must match your screenshot ("test")
DB_NAME = "test"       
COLLECTION = "BedDailyinputs"    
CSV_FILE = os.path.join("Save_file", "Bed", "New Hospital ETU_dataset_2000-2024.csv")

# --- 2. CONNECT TO CLOUD ---
print("⏳ Connecting to MongoDB Atlas (ITPM Cluster)...")
try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client[DB_NAME]
    collection = db[COLLECTION]
    client.admin.command('ping')
    print("✅ Connected to Cloud Database!")
except Exception as e:
    print(f"❌ Connection Failed: {e}")
    exit()

# --- 3. LOAD CSV ---
base_path = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_path, CSV_FILE)

if os.path.exists(file_path):
    print(f"📖 Reading {CSV_FILE}...")
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
    records = df.to_dict(orient='records')
    
    print(f"🚀 Uploading {len(records)} records to 'test' database...")
    collection.delete_many({}) 
    collection.insert_many(records)
    print(f"✅ SUCCESS: History migrated to Database '{DB_NAME}'!")
else:
    print("❌ CSV file not found.")