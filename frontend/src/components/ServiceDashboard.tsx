'use client';

import { useState, useEffect } from 'react';
import { EmergencyService, EmergencyRequest, ServiceResource, Volunteer, ServiceDashboard } from '@/types/emergency';
import Map from './Map';
import PriorityTaskList from './PriorityTaskList';
import ResourceAvailability from './ResourceAvailability';

interface ServiceDashboardProps {
  service: EmergencyService;
  onRequestSelect: (request: EmergencyRequest) => void;
  onResourceSelect: (resource: ServiceResource) => void;
  onVolunteerSelect: (volunteer: Volunteer) => void;
}

export default function ServiceDashboard({
  service,
  onRequestSelect,
  onResourceSelect,
  onVolunteerSelect
}: ServiceDashboardProps) {
  const [dashboard, setDashboard] = useState<ServiceDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'requests' | 'resources' | 'volunteers'>('requests');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        const data = await fetchServiceDashboard(service);
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [service]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboard.stats.totalRequests}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Active Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">{dashboard.stats.activeRequests}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Available Resources</h3>
          <p className="text-3xl font-bold text-green-600">{dashboard.stats.availableResources}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Active Volunteers</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboard.stats.activeVolunteers}</p>
        </div>
      </div>

      {/* Service Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedTab('requests')}
            className={`flex-1 px-4 py-3 text-center font-medium ${
              selectedTab === 'requests'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Emergency Requests
          </button>
          <button
            onClick={() => setSelectedTab('resources')}
            className={`flex-1 px-4 py-3 text-center font-medium ${
              selectedTab === 'resources'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setSelectedTab('volunteers')}
            className={`flex-1 px-4 py-3 text-center font-medium ${
              selectedTab === 'volunteers'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Volunteers
          </button>
        </div>

        <div className="p-4">
          {selectedTab === 'requests' && (
            <div className="space-y-4">
              <Map
                markers={dashboard.activeRequests.map(req => ({
                  id: req.id,
                  type: 'request',
                  position: req.location,
                  title: `${req.type} - ${req.urgency}`,
                  description: req.description,
                  priority: req.priority
                }))}
              />
              <PriorityTaskList
                tasks={dashboard.activeRequests.map(req => ({
                  id: req.id,
                  requestId: req.id,
                  priority: req.priority,
                  status: req.status,
                  resources: req.resources.map(r => ({
                    id: r.type,
                    type: r.type as any,
                    quantity: r.quantity,
                    location: req.location,
                    status: 'available'
                  })),
                  location: req.location
                }))}
                onTaskSelect={(task) => {
                  const request = dashboard.activeRequests.find(r => r.id === task.id);
                  if (request) onRequestSelect(request);
                }}
                onStatusUpdate={() => {}}
                userRole="first_responder"
              />
            </div>
          )}

          {selectedTab === 'resources' && (
            <ResourceAvailability
              resources={dashboard.availableResources.map(res => ({
                id: res.id,
                type: res.type as any,
                quantity: res.quantity,
                location: res.location,
                status: res.status
              }))}
              onResourceSelect={(resource) => {
                const serviceResource = dashboard.availableResources.find(r => r.id === resource.id);
                if (serviceResource) onResourceSelect(serviceResource);
              }}
              userRole="first_responder"
            />
          )}

          {selectedTab === 'volunteers' && (
            <div className="space-y-4">
              <Map
                markers={dashboard.nearbyVolunteers.map(vol => ({
                  id: vol.id,
                  type: 'volunteer',
                  position: vol.location,
                  title: vol.name,
                  description: `Skills: ${vol.skills.join(', ')}`
                }))}
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dashboard.nearbyVolunteers.map(volunteer => (
                  <div
                    key={volunteer.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onVolunteerSelect(volunteer)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <h3 className="font-semibold">{volunteer.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          volunteer.status === 'available' ? 'bg-green-100 text-green-800' :
                          volunteer.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {volunteer.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>Skills: {volunteer.skills.join(', ')}</p>
                      <p>Assigned Tasks: {volunteer.assignedTasks.length}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle volunteer contact
                        }}
                        className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Contact Volunteer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock API function (replace with actual API call)
async function fetchServiceDashboard(service: EmergencyService): Promise<ServiceDashboard> {
  return {
    service,
    activeRequests: [],
    availableResources: [],
    nearbyVolunteers: [],
    stats: {
      totalRequests: 0,
      activeRequests: 0,
      availableResources: 0,
      activeVolunteers: 0
    }
  };
} 