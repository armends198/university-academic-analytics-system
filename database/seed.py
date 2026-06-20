from pymongo import MongoClient
import json
import os
import bcrypt

DEFAULT_PASSWORD = "Password123!"

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "academic_analytics"

import certifi
import sys
import urllib.parse

print("Connecting to MongoDB...")
if os.environ.get("MONGO_URI"):
    print("Using MONGO_URI from environment")
else:
    print("No MONGO_URI found; using default localhost:27017")

parsed_uri = urllib.parse.urlparse(MONGO_URI)
print("Connection scheme:", parsed_uri.scheme)
print("Host:", parsed_uri.netloc)

use_tls = not (
    MONGO_URI.startswith("mongodb://localhost")
    or MONGO_URI.startswith("mongodb://127.0.0.1")
    or MONGO_URI.startswith("mongodb://[::1]")
)

client_kwargs = {
    "serverSelectionTimeoutMS": 20000,
    "connectTimeoutMS": 20000,
}
if use_tls:
    client_kwargs["tls"] = True
    client_kwargs["tlsCAFile"] = certifi.where()

try:
    client = MongoClient(MONGO_URI, **client_kwargs)
    client.admin.command("ping")
except Exception as exc:
    print("Failed to connect to MongoDB.")
    print("Connection string:", "[masked]" if "@" in MONGO_URI else MONGO_URI)
    print("Error:", exc)
    sys.exit(1)

db = client[DB_NAME]

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

    for user in data:
        if col_name == "users" and user.get("passwordHash") == "hashed_password_here":
            user["passwordHash"] = hash_password(DEFAULT_PASSWORD)

    col.insert_many(data)
    print(f"Seeded {len(data)} documents into '{col_name}'")

print("Done.")