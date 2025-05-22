const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface EmergencyRequest {
  id?: string;
  text: string;
  urgency: string;
  type: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'resolved';
}

export async function submitRequest(text: string, urgency?: string, type?: string): Promise<EmergencyRequest> {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, urgency, type }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit request');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchRequests(): Promise<EmergencyRequest[]> {
  const response = await fetch(`${API_BASE_URL}/requests`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch requests');
  }

  return response.json();
}

export async function updateRequestStatus(id: string, status: EmergencyRequest['status']): Promise<EmergencyRequest> {
  const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update request');
  }

  return response.json();
}
