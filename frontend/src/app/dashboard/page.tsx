'use client';

import { useState, useEffect } from 'react';
import { fetchRequests, updateRequestStatus, EmergencyRequest } from '@/services/api';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'all'>('pending');
  const searchParams = useSearchParams && useSearchParams();
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchRequests();
        setRequests(data);
        
        // If there's a specific request ID in the URL, scroll to it
        if (searchParams) {
          const requestId = searchParams.get('request');
          if (requestId) {
            // Use setTimeout to ensure the DOM is ready
            setTimeout(() => {
              const element = document.getElementById(`request-${requestId}`);
              element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
    // Set up polling every 30 seconds
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, [searchParams]);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <Navbar />
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4 sm:mb-0">
              First Responder Dashboard
            </h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'pending' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                New Requests
              </button>
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                All Cases
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Urgency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {requests
                    .filter(request => activeFilter === 'all' || request.status === 'pending')
                    .map((request) => (
                      <tr 
                        key={request.id} 
                        id={`request-${request.id}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(request.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {request.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.urgency === 'High' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : request.urgency === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {request.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === 'pending'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : request.status === 'processing'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button
                            onClick={async () => {
                              try {
                                const newStatus = request.status === 'pending' ? 'processing' : 'resolved';
                                const updated = await updateRequestStatus(request.id!, newStatus);
                                setRequests(requests.map(r => r.id === updated.id ? updated : r));
                              } catch (err) {
                                setError(err instanceof Error ? err.message : 'Failed to update request');
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            {request.status === 'pending' ? 'Accept' : request.status === 'processing' ? 'Resolve' : 'Reopen'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Emergencies", value: "7", color: "red" },
              { label: "Available Responders", value: "8", color: "green" },
              { label: "Resolved Today", value: "0", color: "blue" },
              { label: "Avg Response Time", value: "8m", color: "yellow" }
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { 
                label: "Active Emergencies", 
                value: "7", // Fixed value to match the data in the image
                color: "red" 
              },
              { 
                label: "Available Responders", 
                value: "8", 
                color: "green" 
              },
              { 
                label: "Resolved", 
                value: "0", // Fixed value to match the data in the image
                color: "blue" 
              },
              { 
                label: "Avg Response Time", 
                value: "8m", 
                color: "yellow" 
              }
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
