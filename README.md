# SafeBridge - AI-Powered Disaster Response Platform

SafeBridge is a web application designed to connect volunteers, first responders, and affected individuals during emergencies and disaster situations. It provides a platform for requesting help, coordinating responses, and facilitating communication during critical times.

## Project Structure

The project is divided into two main parts:
- **Frontend**: A Next.js application with React
- **Backend**: A Flask API server 

## Features

- **Multi-step user registration** for different roles (affected individuals, first responders, volunteers)
- User authentication with role-based access
- Emergency request submission and tracking
- Dashboard customized for different user roles
- Real-time chat functionality with AI assistance
- Volunteer skills and availability management

## Registration Flow

The platform offers a three-step registration process:

1. **Account Creation**: Basic user information and credentials
2. **Role & Location Selection**: User selects their role and provides location information
3. **Experience & Specialties** (for responders/volunteers): Additional information about skills and availability

Each role has different requirements:
- **Affected Individuals**: Only steps 1 and 2 are required
- **First Responders and Volunteers**: All three steps are required, with specialized fields for experience, specialties, and availability

## Quick Start

### Run with PowerShell Script (Recommended)

1. Open PowerShell
2. Navigate to the project directory
3. Run the start script:

```powershell
cd "c:\Users\locha\Desktop\Gen_AI_projects\ai_powered_disaster_Team_Neura"
.\start-app.ps1
```

This will start both the backend and frontend servers in separate windows.

### Testing the Registration Flow

To thoroughly test the multi-step registration process, you can use the provided test scripts:

```powershell
# Basic test instructions and server startup
.\test-registration-flow.ps1

# Detailed test cases and instructions
.\registration-test-cases.ps1
```

These scripts provide step-by-step instructions for testing different user roles (Person in Need, First Responder, Volunteer) and validation scenarios to ensure the registration flow works correctly.

### Manual Setup

#### Backend (Flask)

1. Navigate to the backend directory
2. Install dependencies
3. Run the Flask server:

```powershell
cd "c:\Users\locha\Desktop\Gen_AI_projects\ai_powered_disaster_Team_Neura\backend"
pip install -r requirements.txt
python app.py
```

The backend server will run on http://localhost:3001

#### Frontend (Next.js)

1. Navigate to the frontend directory
2. Install dependencies
3. Run the development server:

```powershell
cd "c:\Users\locha\Desktop\Gen_AI_projects\ai_powered_disaster_Team_Neura\frontend"
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

## Test Accounts

You can log in using these pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| Affected Individual | individual@example.com | password123 |
| Volunteer | volunteer@example.com | password123 |
| First Responder | responder@example.com | password123 |
| Government | government@example.com | password123 |

## Prerequisites

- Python 3.7+
- Node.js and npm
- Git

### Installation

1. Clone the repository
2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

#### Option 1: Using the PowerShell script
Run the PowerShell script `start-app.ps1` in the project root directory.

#### Option 2: Manual startup

Start the backend:
```bash
cd backend
python app.py
```

Start the frontend in another terminal:
```bash
cd frontend
npm run dev
```

## Troubleshooting

### Login/Registration Issues

- Make sure both backend and frontend servers are running
- Check browser console for errors (F12 in most browsers)
- Verify that you can access the backend API at http://localhost:3001
- Try using one of the test accounts listed above

### Server Connection Issues

- Ensure ports 3000 and 3001 are not in use by other applications
- Check that you have the correct Python and Node.js versions installed
- Try restarting both servers
Start the backend:
```bash
cd backend
python app.py
```

Start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

### Frontend
The frontend is built with Next.js and includes:
- TypeScript for type safety
- Tailwind CSS for styling
- Context API for state management

### Backend
The backend API is built with Flask and provides:
- RESTful API endpoints
- Authentication services
- Data persistence

## License

This project is licensed under the MIT License.
