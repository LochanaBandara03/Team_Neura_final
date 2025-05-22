# SafeBridge - AI-Powered Disaster Response Platform (Backend)

## Overview
This is the backend for the SafeBridge platform, a disaster response system that uses AI to categorize and prioritize emergency requests.

## Tech Stack
- **Node.js** with **Express** for the REST API
- **MongoDB** for data storage
- **OpenAI API** for analyzing emergency messages
- **Mongoose** for MongoDB object modeling

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or access to MongoDB Atlas)

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/safebridge
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Install dependencies:
```
npm install
```

2. Seed the database with sample data:
```
npm run seed
```

3. Start the development server:
```
npm run dev
```

4. For production:
```
npm start
```

## API Endpoints

### Emergency Requests
- `POST /api/submit-request` - Submit a new emergency request
  - Body: `{ "text": "Emergency help needed for [name] at [location]. Details: [description]" }`

- `GET /api/requests` - Get all emergency requests

- `GET /api/requests/:id` - Get a specific emergency request by ID

- `PATCH /api/requests/:id` - Update the status of a request
  - Body: `{ "status": "pending|processing|resolved" }`

## Data Model

### Emergency Request
```
{
  text: String,           // The original emergency message
  urgency: String,        // High, Medium, Low, or Unknown
  type: String,           // Medical, Food, Shelter, Evacuation, Other, or Unknown
  location: String,       // Location extracted from the message
  timestamp: Date,        // When the request was created
  status: String,         // pending, processing, or resolved
  lastUpdated: Date       // When the request was last updated
}
```
