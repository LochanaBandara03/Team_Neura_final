import { LoginCredentials, AuthResponse, UserRole } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface EmergencyRequest {
  id: string;
  text: string;
  urgency: 'High' | 'Medium' | 'Low' | 'Unknown';
  type: 'Medical' | 'Food' | 'Shelter' | 'Evacuation' | 'Other' | 'Unknown';
  location: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'resolved';
  lastUpdated?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  location: string;
}

export interface VolunteerData {
  email: string;
  name: string;
  role: UserRole;
  specialties: string[];
  availability: string;
  experience: string;
  location: string;
}

// Login function to authenticate users
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Register function for new users
export async function register(userData: RegisterData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function submitRequest(text: string, urgency?: string, type?: string): Promise<EmergencyRequest> {
  const response = await fetch(`${API_BASE_URL}/api/submit-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, urgency, type }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit request');
  }

  return response.json();
}

export async function fetchRequests(): Promise<EmergencyRequest[]> {
  const response = await fetch(`${API_BASE_URL}/api/requests`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch requests');
  }

  return response.json();
}

export async function updateRequestStatus(id: string, status: EmergencyRequest['status']): Promise<EmergencyRequest> {
  const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update request');
  }

  return response.json();
}

// Function to register as a volunteer with specific details
export async function registerVolunteer(volunteerData: VolunteerData): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register-volunteer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(volunteerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register volunteer');
    }

    return response.json();
  } catch (error) {
    console.error('Volunteer registration error:', error);
    throw error;
  }
}
