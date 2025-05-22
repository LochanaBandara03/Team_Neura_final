const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');
const { processWithOpenAI } = require('../services/openai');

// Submit a new help request
router.post('/submit-request', async (req, res) => {
  try {
    const { text, urgency: clientUrgency, type: clientType } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    console.log('Received request with text:', text);
    console.log('Client provided urgency:', clientUrgency);
    console.log('Client provided type:', clientType);
    
    // Extract location from text if possible
    const locationMatch = text.match(/at\s+([^\.]+)/);
    const extractedLocation = locationMatch ? locationMatch[1].trim() : 'Unknown';
    
    let parsedData;
    
    try {
      // Process text with OpenAI only if client didn't provide urgency and type
      if (!clientUrgency || !clientType) {
        parsedData = await processWithOpenAI(text);
        console.log('AI processed data:', parsedData);
      } else {
        // Use client-provided values
        parsedData = {
          urgency: clientUrgency,
          type: clientType,
          location: extractedLocation
        };
      }
    } catch (aiError) {
      console.error('OpenAI processing error:', aiError);
      // Fallback if OpenAI fails
      parsedData = {
        urgency: clientUrgency || (text.toLowerCase().includes('urgent') ? 'High' : 'Medium'),
        type: clientType || 'Other',
        location: extractedLocation
      };
    }

    // Prepare request data with fallback values
    const requestData = {
      text,
      urgency: parsedData?.urgency || 'Medium',
      type: parsedData?.type || 'Other',
      location: parsedData?.location || extractedLocation,
      timestamp: new Date().toISOString(),
      status: 'pending' // Additional field for request tracking
    };

    // Store in MongoDB
    const newRequest = new EmergencyRequest(requestData);
    await newRequest.save();
    
    console.log('Created new request:', newRequest._id);

    res.status(201).json({
      id: newRequest._id,
      ...requestData
    });

  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ message: 'Failed to process request', error: error.message });
  }
});

// Get all requests
router.get('/requests', async (req, res) => {
  try {
    // Get all requests from MongoDB and sort by timestamp (most recent first)
    const requests = await EmergencyRequest.find()
      .sort({ timestamp: -1 })
      .lean();
    
    // Format the response
    const formattedRequests = requests.map(request => ({
      id: request._id,
      ...request,
      _id: undefined
    }));

    res.json(formattedRequests);

  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get request by ID
router.get('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await EmergencyRequest.findById(id).lean();
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({
      id: request._id,
      ...request,
      _id: undefined
    });

  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Update request status
router.patch('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const updatedRequest = await EmergencyRequest.findByIdAndUpdate(
      id,
      { 
        status,
        lastUpdated: new Date().toISOString() 
      },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.json({
      id: updatedRequest._id,
      ...updatedRequest,
      _id: undefined
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

module.exports = router;
