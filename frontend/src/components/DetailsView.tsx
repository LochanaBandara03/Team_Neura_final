'use client';

import { EmergencyRequest, ServiceResource, Volunteer } from '@/types/emergency';

interface DetailsViewProps {
  type: 'request' | 'resource' | 'volunteer';
  data: EmergencyRequest | ServiceResource | Volunteer;
  onClose: () => void;
}

export default function DetailsView({ type, data, onClose }: DetailsViewProps) {
  const renderRequestDetails = (request: EmergencyRequest) => (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{request.type}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${
            request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
            request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
            request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {request.urgency}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          request.status === 'pending' ? 'bg-gray-100 text-gray-800' :
          request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
          request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {request.status.replace('_', ' ')}
        </span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Description:</strong> {request.description}</p>
        <p><strong>Location:</strong> {request.location.lat.toFixed(4)}, {request.location.lng.toFixed(4)}</p>
        <p><strong>Contact:</strong> {request.contact.name} ({request.contact.phone})</p>
        <p><strong>Priority:</strong> {request.priority}/10</p>
        <p><strong>Tags:</strong> {request.tags.join(', ')}</p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="font-semibold mb-2">Required Resources</h4>
        <div className="grid gap-2">
          {request.resources.map((resource, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span>{resource.type}</span>
              <span className="text-sm text-gray-500">Quantity: {resource.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResourceDetails = (resource: ServiceResource) => (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{resource.type}</h3>
          <span className="text-sm text-gray-500">{resource.service}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          resource.status === 'available' ? 'bg-green-100 text-green-800' :
          resource.status === 'in_use' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {resource.status.replace('_', ' ')}
        </span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        <p><strong>Quantity:</strong> {resource.quantity}</p>
        <p><strong>Location:</strong> {resource.location.lat.toFixed(4)}, {resource.location.lng.toFixed(4)}</p>
        {resource.assignedTo && (
          <p><strong>Assigned To:</strong> {resource.assignedTo}</p>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // TODO: Implement resource allocation
          }}
        >
          Allocate Resource
        </button>
      </div>
    </div>
  );

  const renderVolunteerDetails = (volunteer: Volunteer) => (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{volunteer.name}</h3>
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
        <p><strong>Skills:</strong> {volunteer.skills.join(', ')}</p>
        <p><strong>Location:</strong> {volunteer.location.lat.toFixed(4)}, {volunteer.location.lng.toFixed(4)}</p>
        <p><strong>Contact:</strong> {volunteer.contact.phone}</p>
        <p><strong>Email:</strong> {volunteer.contact.email}</p>
        <p><strong>Assigned Tasks:</strong> {volunteer.assignedTasks.length}</p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // TODO: Implement volunteer contact
          }}
        >
          Contact Volunteer
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {type === 'request' ? 'Request Details' :
           type === 'resource' ? 'Resource Details' :
           'Volunteer Details'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {type === 'request' && renderRequestDetails(data as EmergencyRequest)}
      {type === 'resource' && renderResourceDetails(data as ServiceResource)}
      {type === 'volunteer' && renderVolunteerDetails(data as Volunteer)}
    </div>
  );
} 