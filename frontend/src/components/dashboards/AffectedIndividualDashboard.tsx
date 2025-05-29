'use client';

import { useState } from 'react';
import { EmergencyRequest, submitRequest } from '@/services/api';
import { HelpRequest } from '@/types';

export interface AffectedIndividualDashboardProps {
  requests?: EmergencyRequest[];
}

export default function AffectedIndividualDashboard({ requests = [] }: AffectedIndividualDashboardProps) {
  const [helpForm, setHelpForm] = useState<HelpRequest>({
    fullName: '',
    location: '',
    description: '',
    type: 'Other',
    urgency: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const message = `Emergency help needed at ${helpForm.location}. Details: ${helpForm.description}`;
      await submitRequest(message, helpForm.urgency, helpForm.type);
      
      // Reset form after successful submission
      setHelpForm({
        fullName: '',
        location: '',
        description: '',
        type: 'Other',
        urgency: 'Medium'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30">
          <h3 className="font-medium text-red-700 dark:text-red-300">Medical Help</h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">Request immediate medical assistance</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30">
          <h3 className="font-medium text-green-700 dark:text-green-300">Food & Water</h3>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Request essential supplies</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30">
          <h3 className="font-medium text-blue-700 dark:text-blue-300">Shelter</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Find safe accommodation</p>
        </div>
      </div>

      {/* Help Request Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Submit Help Request</h3>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type of Help Needed
              </label>
              <select 
                value={helpForm.type}
                onChange={(e) => setHelpForm({ ...helpForm, type: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="Medical">Medical Assistance</option>
                <option value="Food">Food & Water</option>
                <option value="Shelter">Shelter</option>
                <option value="Evacuation">Evacuation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Urgency Level
              </label>
              <select 
                value={helpForm.urgency}
                onChange={(e) => setHelpForm({ ...helpForm, urgency: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="Low">Low - Can wait</option>
                <option value="Medium">Medium - Need help soon</option>
                <option value="High">High - Urgent help needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea 
                value={helpForm.description}
                onChange={(e) => setHelpForm({ ...helpForm, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Please describe your situation and what help you need..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input 
                type="text"
                value={helpForm.location}
                onChange={(e) => setHelpForm({ ...helpForm, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your current location"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Status Updates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Requests</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {requests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      : request.status === 'processing'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    {request.type} Request
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {request.text}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Submitted {new Date(request.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No requests submitted yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
