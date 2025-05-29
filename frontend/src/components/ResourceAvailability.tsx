'use client';

import { Resource, ResourceType } from '@/types/dashboard';
import { useState } from 'react';

interface ResourceAvailabilityProps {
  resources: Resource[];
  onResourceSelect: (resource: Resource) => void;
  userRole: string;
}

export default function ResourceAvailability({
  resources,
  onResourceSelect,
  userRole
}: ResourceAvailabilityProps) {
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type === filter;
  });

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'ambulance':
        return '🚑';
      case 'medkit':
        return '💊';
      case 'food':
        return '🍞';
      case 'volunteer':
        return '👥';
      default:
        return '📦';
    }
  };

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_use':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'unavailable':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Resource Availability
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ambulance')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'ambulance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Ambulances
          </button>
          <button
            onClick={() => setFilter('medkit')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'medkit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Med Kits
          </button>
          <button
            onClick={() => setFilter('food')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'food'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Food
          </button>
          <button
            onClick={() => setFilter('volunteer')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'volunteer'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Volunteers
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onResourceSelect(resource)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getResourceIcon(resource.type)}</span>
              <div>
                <h3 className="font-semibold capitalize">{resource.type.replace('_', ' ')}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(resource.status)}`}>
                  {resource.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Quantity: {resource.quantity}</p>
              <p>Location: {resource.location.lat.toFixed(4)}, {resource.location.lng.toFixed(4)}</p>
            </div>

            {(userRole === 'first_responder' || userRole === 'government') && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle resource allocation
                  }}
                  className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Allocate Resource
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 