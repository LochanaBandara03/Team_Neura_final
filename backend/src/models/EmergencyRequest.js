const mongoose = require('mongoose');

const EmergencyRequestSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Emergency request text is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: {
      values: ['High', 'Medium', 'Low', 'Unknown'],
      message: 'Urgency must be either High, Medium, Low, or Unknown'
    },
    default: 'Unknown'
  },
  type: {
    type: String,
    enum: {
      values: ['Medical', 'Food', 'Shelter', 'Evacuation', 'Other', 'Unknown'],
      message: 'Type must be Medical, Food, Shelter, Evacuation, Other, or Unknown'
    },
    default: 'Unknown'
  },
  location: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'resolved'],
      message: 'Status must be pending, processing, or resolved'
    },
    default: 'pending'
  },
  lastUpdated: {
    type: Date
  }
}, {
  // Enable virtual properties when converting to JSON/Object
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  // Add createdAt and updatedAt timestamps
  timestamps: true
});

// Pre-save middleware to update lastUpdated timestamp
EmergencyRequestSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Create a virtual for response time calculation
EmergencyRequestSchema.virtual('responseTime').get(function() {
  if (this.status === 'pending' || !this.lastUpdated) {
    return null;
  }
  return (this.lastUpdated - this.timestamp) / (1000 * 60); // in minutes
});

const EmergencyRequest = mongoose.model('EmergencyRequest', EmergencyRequestSchema);

module.exports = EmergencyRequest;
