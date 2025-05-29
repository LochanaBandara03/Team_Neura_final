export type EmergencyService = 'police' | 'ambulance' | 'firefighter';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface EmergencyRequest {
  id: string;
  type: EmergencyService;
  urgency: UrgencyLevel;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  assignedTo?: string;
  resources: {
    type: string;
    quantity: number;
  }[];
  contact: {
    name: string;
    phone: string;
  };
  timestamp: string;
  priority: number;
  tags: string[];
}

export interface ServiceResource {
  id: string;
  service: EmergencyService;
  type: string;
  quantity: number;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'in_use' | 'unavailable';
  assignedTo?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'busy' | 'offline';
  contact: {
    phone: string;
    email: string;
  };
  assignedTasks: string[];
}

export interface ServiceDashboard {
  service: EmergencyService;
  activeRequests: EmergencyRequest[];
  availableResources: ServiceResource[];
  nearbyVolunteers: Volunteer[];
  stats: {
    totalRequests: number;
    activeRequests: number;
    availableResources: number;
    activeVolunteers: number;
  };
} 