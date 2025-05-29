export type ResourceType = 'ambulance' | 'medkit' | 'food' | 'volunteer';

export interface Resource {
  id: string;
  type: ResourceType;
  quantity: number;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'in_use' | 'unavailable';
}

export interface Task {
  id: string;
  requestId: string;
  priority: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  assignedTo?: string;
  resources: Resource[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface MapMarker {
  id: string;
  type: 'request' | 'resource' | 'volunteer';
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  description: string;
  priority?: number;
}

export interface WeatherUpdate {
  temperature: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
  timestamp: string;
}

export interface DashboardStats {
  totalRequests: number;
  activeRequests: number;
  availableResources: number;
  activeVolunteers: number;
  weather: WeatherUpdate;
} 