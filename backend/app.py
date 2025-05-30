from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import uuid
import time
import logging
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId

# Load environment variables
load_dotenv()

# Enable logging
logging.basicConfig(level=logging.INFO)

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.environ.get("MONGODB_DB", "safebridge")

# MongoDB setup
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]
users_col = db["users"]
volunteers_col = db["volunteers"]
requests_col = db["requests"]

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    },
)


@app.before_request
def log_request_info():
    app.logger.info("Headers: %s", request.headers)
    app.logger.info("Body: %s", request.get_data())


@app.route("/")
def index():
    return jsonify({"message": "SafeBridge API (MongoDB) is running"}), 200


@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    time.sleep(0.3)
    user = users_col.find_one({"email": email, "password": password})
    if user:
        return jsonify(
            {
                "token": "mock-jwt-token-" + str(uuid.uuid4()),
                "role": user.get("role", ""),
                "fullName": user.get("fullName", ""),
                "location": user.get("location", ""),
            }
        ), 200
    return jsonify({"error": "Invalid email or password"}), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    if users_col.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409
    new_user = {
        "email": email,
        "password": data.get("password"),
        "fullName": data.get("fullName", ""),
        "location": data.get("location", ""),
        "role": data.get("role", "affected_individual"),
    }
    users_col.insert_one(new_user)
    return jsonify(
        {
            "token": "mock-jwt-token-" + str(uuid.uuid4()),
            "role": new_user["role"],
            "fullName": new_user["fullName"],
            "location": new_user["location"],
        }
    ), 201


@app.route("/api/register-volunteer", methods=["POST"])
def register_volunteer():
    data = request.get_json()
    profile_data = {
        "email": data.get("email"),
        "name": data.get("name"),
        "role": data.get("role", "volunteer"),
        "location": data.get("location", ""),
        "specialties": data.get("specialties", []),
        "availability": data.get("availability", ""),
        "experience": data.get("experience", ""),
        "createdAt": datetime.now().timestamp() * 1000,
    }
    result = volunteers_col.insert_one(profile_data)
    return jsonify(
        {"message": "Profile registered successfully", "id": str(result.inserted_id)}
    ), 201


@app.route("/api/submit-request", methods=["POST"])
def submit_request():
    data = request.get_json()
    text = data.get("text")
    urgency = data.get("urgency", "Unknown")
    req_type = data.get("type", "Unknown")
    location = data.get("location", "User reported location")
    if not text:
        return jsonify({"error": "Text is required"}), 400
    new_request = {
        "text": text,
        "urgency": urgency,
        "type": req_type,
        "location": location,
        "timestamp": datetime.now().timestamp() * 1000,
        "status": "pending",
        "lastUpdated": None,
    }
    result = requests_col.insert_one(new_request)
    new_request["id"] = str(result.inserted_id)
    return jsonify(new_request), 201


@app.route("/api/requests", methods=["GET"])
def get_requests():
    reqs = list(requests_col.find())
    for r in reqs:
        r["id"] = str(r["_id"])
        r.pop("_id", None)
    return jsonify(reqs), 200


@app.route("/api/requests/<request_id>", methods=["GET"])
def get_request(request_id):
    req = requests_col.find_one({"_id": ObjectId(request_id)})
    if req:
        req["id"] = str(req["_id"])
        req.pop("_id", None)
        return jsonify(req), 200
    return jsonify({"error": "Request not found"}), 404


@app.route("/api/requests/<request_id>", methods=["PATCH"])
def update_request(request_id):
    data = request.get_json()
    status = data.get("status")
    if not status:
        return jsonify({"error": "Status is required"}), 400
    result = requests_col.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": status, "lastUpdated": datetime.now().timestamp() * 1000}},
    )
    if result.matched_count:
        req = requests_col.find_one({"_id": ObjectId(request_id)})
        req["id"] = str(req["_id"])
        req.pop("_id", None)
        return jsonify(req), 200
    return jsonify({"error": "Request not found"}), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))
    app.run(debug=True, host="0.0.0.0", port=port)
