import certifi
from pymongo import MongoClient
from datetime import datetime

MONGO_URI = 'mongodb+srv://famousfiveproject31:gg79ZAXI9vSELnAr@itpm.gsmz0.mongodb.net/test?appName=ITPM'
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client['Research']

# Check Illness_Inputs collection
count = db['Illness_Inputs'].count_documents({})
print('Testing Illness_Inputs Collection')
print('='*60)
print('Total records:', count)

# Try to insert a test record manually
if count == 0:
    print('\nInserting test record...')
    test_doc = {
        'date': '2026-03-04',
        'disease': 'Dengue',
        'severity': 'High',
        'cases': 25,
        'department': 'Emergency',
        'ageGroup': 'Adult (18-60)',
        'granularity': 'Weekly',
        'timestamp': datetime.now()
    }
    result = db['Illness_Inputs'].insert_one(test_doc)
    print(f'Test record saved with ID: {result.inserted_id}')
    
# List recent records
recent = list(db['Illness_Inputs'].find().sort('_id', -1).limit(3))
if recent:
    print('\nRecent Records:')
    for i, doc in enumerate(recent, 1):
        disease = doc.get('disease')
        cases = doc.get('cases')
        date = doc.get('date')
        print(f'{i}. {disease} - {cases} cases | {date}')
else:
    print('No records found')

print('='*60)
