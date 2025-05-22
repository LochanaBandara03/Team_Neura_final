const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function processWithOpenAI(text) {
  // If no API key is configured or mock flag is enabled, return mock data
  if (!process.env.OPENAI_API_KEY || process.env.USE_MOCK_AI === 'true') {
    console.log('Using mock AI analyzer (OpenAI API key not provided or mock flag enabled)');
    return mockAnalyzeEmergency(text);
  }
  
  try {
    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a disaster response analyzer. Extract the urgency level (High/Medium/Low), type of emergency (Medical/Food/Shelter/Evacuation/Other), and location from the message. Return only JSON."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    console.log('OpenAI response received');
    
    // Parse the JSON response
    const responseText = completion.choices[0].message.content;
    console.log('Response text:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      return mockAnalyzeEmergency(text);
    }
    
    return {
      urgency: result.urgency || "Medium",
      type: result.type || "Other",
      location: result.location || "Unknown"
    };

  } catch (error) {
    console.error('OpenAI processing error:', error);
    return mockAnalyzeEmergency(text);
  }
}

// Fallback function that mimics AI analysis when OpenAI is not available
function mockAnalyzeEmergency(text) {
  console.log('Using mock emergency analysis');
  
  // Simple keyword-based analysis
  const textLower = text.toLowerCase();
  
  // Determine urgency
  let urgency = 'Medium';
  if (textLower.includes('urgent') || textLower.includes('emergency') || 
      textLower.includes('critical') || textLower.includes('immediately')) {
    urgency = 'High';
  } else if (textLower.includes('soon') || textLower.includes('need help')) {
    urgency = 'Medium';
  } else {
    urgency = 'Low';
  }
  
  // Determine type
  let type = 'Other';
  if (textLower.includes('medical') || textLower.includes('injury') || 
      textLower.includes('hurt') || textLower.includes('pain')) {
    type = 'Medical';
  } else if (textLower.includes('food') || textLower.includes('hungry') || 
             textLower.includes('water') || textLower.includes('thirsty')) {
    type = 'Food';
  } else if (textLower.includes('shelter') || textLower.includes('home') || 
             textLower.includes('housing') || textLower.includes('roof')) {
    type = 'Shelter';
  } else if (textLower.includes('evacuate') || textLower.includes('escape') || 
             textLower.includes('leave') || textLower.includes('flee')) {
    type = 'Evacuation';
  }
  
  // Extract location
  const locationMatch = text.match(/at\s+([^\.]+)/i);
  const location = locationMatch ? locationMatch[1].trim() : 'Unknown';
  
  return { urgency, type, location };
}

module.exports = {
  processWithOpenAI
};
