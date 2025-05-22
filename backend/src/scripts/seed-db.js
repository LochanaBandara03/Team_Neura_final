const mongoose = require('mongoose');
require('dotenv').config();
const { connectDB } = require('../config/db');
const EmergencyRequest = require('../models/EmergencyRequest');

// Sample emergency requests data
const sampleRequests = [
  {
    text: "I need medical assistance at 123 Main St. I have a broken leg and can't move.",
    urgency: "High",
    type: "Medical",
    location: "123 Main St",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: "processing"
  },
  {
    text: "Our building at 456 Oak Ave has been damaged by flooding and we need shelter.",
    urgency: "Medium",
    type: "Shelter",
    location: "456 Oak Ave",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    status: "pending"
  },
  {
    text: "Need food and water supplies at 789 Pine Rd. We have 5 families without provisions.",
    urgency: "Medium",
    type: "Food",
    location: "789 Pine Rd",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    status: "pending"
  },
  {
    text: "Urgent evacuation needed at 321 Elm Blvd due to rising flood waters.",
    urgency: "High",
    type: "Evacuation",
    location: "321 Elm Blvd",
    timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
    status: "processing"
  }
];

// Function to seed the database with sample data
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('Connected to MongoDB. Seeding database...');
    
    // Delete existing data if any
    await EmergencyRequest.deleteMany({});
    console.log('Cleared existing emergency requests');
    
    // Insert sample data
    const result = await EmergencyRequest.insertMany(sampleRequests);
    console.log(`Successfully added ${result.length} emergency requests to the database`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
