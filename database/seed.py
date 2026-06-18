from pymongo import MongoClient
import json
import os

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = "academic_analytics"

client = MongoClient(MONGO_URI)
db     = client[DB_NAME]

collections = [
    ("users",                 "seed/users.json"),
    ("students",              "seed/students.json"),
    ("courses",               "seed/courses.json"),
    ("enrollments",           "seed/enrollments.json"),
    ("performance_snapshots", "seed/performance_snapshots.json"),
]

for col_name, file_path in collections:
    with open(os.path.join(os.path.dirname(__file__), file_path)) as f:
        data = json.load(f)
    col = db[col_name]
    col.delete_many({})
    col.insert_many(data)
    print(f"Seeded {len(data)} documents into '{col_name}'")

print("Done.")