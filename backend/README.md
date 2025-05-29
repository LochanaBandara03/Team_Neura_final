# SafeBridge Backend - Python Flask API

This is the Flask-based backend API for the SafeBridge disaster response platform.

## Features

- User authentication (login/register)
- Emergency request submission and management
- Volunteer registration
- RESTful API endpoints

## Setup Instructions

### Prerequisites
- Python 3.7+ installed

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
python app.py
```

The server will run on port 3001 by default. You can change this in the `.env` file.

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### Emergency Requests
- `POST /api/submit-request` - Submit a new emergency request
- `GET /api/requests` - Get all emergency requests
- `GET /api/requests/{id}` - Get a specific emergency request by ID
- `PATCH /api/requests/{id}` - Update the status of a request

### Volunteers
- `POST /api/register-volunteer` - Register volunteer information

## Integration with Frontend

This backend is designed to work with the SafeBridge frontend. The frontend will communicate with these API endpoints to perform all necessary operations.

## Development

To run the backend in development mode:

```bash
python app.py
```

This will start the server with debug mode enabled.
