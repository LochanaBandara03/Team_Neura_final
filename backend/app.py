from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import uuid
import time
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Enable logging
logging.basicConfig(level=logging.INFO)

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

# Data storage files
USERS_FILE = "data/users.json"
VOLUNTEERS_FILE = "data/volunteers.json"

# Create data directory if it doesn't exist
os.makedirs("data", exist_ok=True)


# Initialize data files if they don't exist
def init_data_files():
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w") as f:
            json.dump([], f)
    if not os.path.exists(VOLUNTEERS_FILE):
        with open(VOLUNTEERS_FILE, "w") as f:
            json.dump([], f)


# Load data from files
def load_users():
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def load_volunteers():
    try:
        with open(VOLUNTEERS_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


# Save data to files
def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)


def save_volunteers(volunteers):
    with open(VOLUNTEERS_FILE, "w") as f:
        json.dump(volunteers, f, indent=2)


# Initialize data files
init_data_files()

# Load initial data
users = load_users()
volunteers = load_volunteers()

# Add some default users if none exist
if not users:
    default_users = [
        {
            "email": "responder@example.com",
            "password": "password123",
            "role": "first_responder",
            "fullName": "John Responder",
            "location": "New York, NY",
        },
        {
            "email": "volunteer@example.com",
            "password": "password123",
            "role": "volunteer",
            "fullName": "Jane Volunteer",
            "location": "Boston, MA",
        },
        {
            "email": "individual@example.com",
            "password": "password123",
            "role": "affected_individual",
            "fullName": "Bob Individual",
            "location": "Chicago, IL",
        },
    ]
    users.extend(default_users)
    save_users(users)

# Mock data storage
emergency_requests = [
    {
        "id": "1",
        "text": "Need medical assistance for an elderly person with diabetes",
        "urgency": "High",
        "type": "Medical",
        "location": "North District, Building 4",
        "timestamp": (datetime.now().timestamp() - 1800) * 1000,  # 30 minutes ago
        "status": "pending",
        "lastUpdated": None,
    },
    {
        "id": "2",
        "text": "Family of 4 needs shelter after apartment flooding",
        "urgency": "Medium",
        "type": "Shelter",
        "location": "Downtown area, near Central Park",
        "timestamp": (datetime.now().timestamp() - 7200) * 1000,  # 2 hours ago
        "status": "processing",
        "lastUpdated": None,
    },
    {
        "id": "3",
        "text": "Running low on drinking water and basic supplies",
        "urgency": "Medium",
        "type": "Food",
        "location": "East Side, Apartment Complex B",
        "timestamp": (datetime.now().timestamp() - 10800) * 1000,  # 3 hours ago
        "status": "pending",
        "lastUpdated": None,
    },
    {
        "id": "4",
        "text": "Need evacuation assistance, road is blocked by fallen tree",
        "urgency": "High",
        "type": "Evacuation",
        "location": "West Hills, Oak Street",
        "timestamp": (datetime.now().timestamp() - 2700) * 1000,  # 45 minutes ago
        "status": "pending",
        "lastUpdated": None,
    },
    {
        "id": "5",
        "text": "Looking for missing pet after storm",
        "urgency": "Low",
        "type": "Other",
        "location": "South District, Pine Avenue",
        "timestamp": (datetime.now().timestamp() - 18000) * 1000,  # 5 hours ago
        "status": "resolved",
        "lastUpdated": None,
    },
]


@app.before_request
def log_request_info():
    app.logger.info("Headers: %s", request.headers)
    app.logger.info("Body: %s", request.get_data())


@app.route("/")
def index():
    return jsonify({"message": "SafeBridge API is running"}), 200


@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()}), 200


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Add a small delay to simulate network latency
        time.sleep(0.3)

        # Reload users from file to ensure we have the latest data
        users = load_users()

        for user in users:
            if user["email"] == email and user["password"] == password:
                return jsonify(
                    {
                        "token": "mock-jwt-token-" + str(uuid.uuid4()),
                        "role": user["role"],
                        "fullName": user.get("fullName", ""),
                        "location": user.get("location", ""),
                    }
                ), 200

        return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500


@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email")
        password = data.get("password")
        fullName = data.get("fullName")
        role = data.get("role")
        location = data.get("location")

        if not all([email, password, fullName, role, location]):
            return jsonify({"error": "All fields are required"}), 400

        # Reload users from file to ensure we have the latest data
        users = load_users()

        # Check if user already exists
        for user in users:
            if user["email"] == email:
                return jsonify({"error": "User already exists"}), 409

        # Add new user
        new_user = {
            "email": email,
            "password": password,
            "fullName": fullName,
            "location": location,
            "role": role,
        }
        users.append(new_user)
        save_users(users)  # Save to file

        return jsonify(
            {
                "token": "mock-jwt-token-" + str(uuid.uuid4()),
                "role": new_user["role"],
                "fullName": new_user["fullName"],
                "location": new_user["location"],
            }
        ), 201
    except Exception as e:
        app.logger.error(f"Registration error: {str(e)}")
        return jsonify({"error": "An error occurred during registration"}), 500


@app.route("/api/submit-request", methods=["POST"])
def submit_request():
    data = request.get_json()
    text = data.get("text")
    urgency = data.get("urgency", "Unknown")
    req_type = data.get("type", "Unknown")
    location = "User reported location"

    if not text:
        return jsonify({"error": "Text is required"}), 400

    # Create new request
    new_id = str(len(emergency_requests) + 1)
    new_request = {
        "id": new_id,
        "text": text,
        "urgency": urgency,
        "type": req_type,
        "location": location,
        "timestamp": datetime.now().timestamp() * 1000,
        "status": "pending",
        "lastUpdated": None,
    }

    emergency_requests.append(new_request)
    return jsonify(new_request), 201


@app.route("/api/requests", methods=["GET"])
def get_requests():
    # Return all requests
    return jsonify(emergency_requests), 200


@app.route("/api/requests/<request_id>", methods=["GET"])
def get_request(request_id):
    # Find request by ID
    for req in emergency_requests:
        if req["id"] == request_id:
            return jsonify(req), 200
    return jsonify({"error": "Request not found"}), 404


@app.route("/api/requests/<request_id>", methods=["PATCH"])
def update_request(request_id):
    data = request.get_json()
    status = data.get("status")

    if not status:
        return jsonify({"error": "Status is required"}), 400

    # Find and update request
    for req in emergency_requests:
        if req["id"] == request_id:
            req["status"] = status
            req["lastUpdated"] = datetime.now().timestamp() * 1000
            return jsonify(req), 200

    return jsonify({"error": "Request not found"}), 404


@app.route("/api/register-volunteer", methods=["POST"])
def register_volunteer():
    data = request.get_json()

    # Reload volunteers from file to ensure we have the latest data
    volunteers = load_volunteers()

    # Add volunteer or first responder
    profile_data = {
        "id": str(len(volunteers) + 1),
        "email": data.get("email"),
        "name": data.get("name"),
        "role": data.get("role", "volunteer"),
        "location": data.get("location", ""),
        "specialties": data.get("specialties", []),
        "availability": data.get("availability", ""),
        "experience": data.get("experience", ""),
        "createdAt": datetime.now().timestamp() * 1000,
    }
    volunteers.append(profile_data)
    save_volunteers(volunteers)  # Save to file

    return jsonify(
        {"message": "Profile registered successfully", "id": profile_data["id"]}
    ), 201


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3001))
    app.run(debug=True, host="0.0.0.0", port=port)
