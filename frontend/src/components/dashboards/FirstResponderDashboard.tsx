'use client';

import { useState } from 'react';
import { EmergencyRequest, updateRequestStatus } from '@/services/api';

export default function FirstResponderDashboard({ requests }: { requests: EmergencyRequest[] }) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState('');

  // Filter and sort requests by urgency
  const sortedRequests = requests
    .filter(r => r.status === 'pending')
    .sort((a, b) => {
      const urgencyOrder = { High: 3, Medium: 2, Low: 1, Unknown: 0 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });

  const handleResponseSubmit = async (request: EmergencyRequest) => {
    try {
      await updateRequestStatus(request.id, 'processing');
      setExpandedRequest(null);
      setResponseNote('');
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Emergency Requests</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-700 dark:text-blue-300">Resource Deployment</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Manage and allocate emergency resources</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-medium text-green-700 dark:text-green-300">Team Coordination</h3>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Coordinate with other responders</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-medium text-purple-700 dark:text-purple-300">Status Reports</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">View and update incident reports</p>
        </div>
      </div>

      {/* Emergency Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Emergency Requests</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedRequests.map((request) => (
            <div 
              key={request.id} 
              className={`p-4 ${
                expandedRequest === request.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.urgency === 'High' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        : request.urgency === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}>
                      {request.urgency}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.type === 'Medical' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        : request.type === 'Food'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>
                      {request.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(request.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{request.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{request.location}</p>
                  {expandedRequest === request.id && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Response Notes</label>
                        <textarea 
                          rows={3}
                          value={responseNote}
                          onChange={(e) => setResponseNote(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Add details about your response..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleResponseSubmit(request)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Accept & Respond
                        </button>
                        <button
                          onClick={() => {
                            setExpandedRequest(null);
                            setResponseNote('');
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {expandedRequest !== request.id && (
                  <button
                    onClick={() => setExpandedRequest(request.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Respond
                  </button>
                )}
              </div>
            </div>
          ))}
          {sortedRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No pending requests at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
