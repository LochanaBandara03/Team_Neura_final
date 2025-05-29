'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { EmergencyService, EmergencyRequest, ServiceResource, Volunteer } from '@/types/emergency';
import Navbar from '@/components/Navbar';
import ServiceDashboard from '@/components/ServiceDashboard';
import DetailsView from '@/components/DetailsView';
import VolunteerDashboard from '@/components/dashboards/VolunteerDashboard';
import FirstResponderDashboard from '@/components/dashboards/FirstResponderDashboard';

export default function DashboardPage() {
  const [selectedService, setSelectedService] = useState<EmergencyService>('police');
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [selectedResource, setSelectedResource] = useState<ServiceResource | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleRequestSelect = (request: EmergencyRequest) => {
    setSelectedRequest(request);
  };

  const handleResourceSelect = (resource: ServiceResource) => {
    setSelectedResource(resource);
  };

  const handleVolunteerSelect = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
    setSelectedResource(null);
    setSelectedVolunteer(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Add extra top margin for dashboard content separation from navbar */}
        <div className="mt-12">
          {/* Service Selection */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedService('police')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  selectedService === 'police'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Police
              </button>
              <button
                onClick={() => setSelectedService('ambulance')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  selectedService === 'ambulance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Ambulance
              </button>
              <button
                onClick={() => setSelectedService('firefighter')}
                className={`px-6 py-3 rounded-lg font-medium ${
                  selectedService === 'firefighter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Firefighter
              </button>
            </div>
          </div>

          {/* Conditional Dashboard Rendering */}
          {user?.role === 'volunteer' ? (
            <VolunteerDashboard requests={[]} />
          ) : user?.role === 'first_responder' ? (
            <FirstResponderDashboard requests={[]} />
          ) : (
            <ServiceDashboard
              service={selectedService}
              onRequestSelect={handleRequestSelect}
              onResourceSelect={handleResourceSelect}
              onVolunteerSelect={handleVolunteerSelect}
            />
          )}

          {/* Details Modal */}
          {(selectedRequest || selectedResource || selectedVolunteer) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <DetailsView
                  type={selectedRequest ? 'request' : selectedResource ? 'resource' : 'volunteer'}
                  data={selectedRequest || selectedResource || selectedVolunteer!}
                  onClose={handleCloseDetails}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
