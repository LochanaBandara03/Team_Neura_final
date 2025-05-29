'use client';

import { useState } from 'react';
import { EmergencyRequest, updateRequestStatus } from '@/services/api';

export default function VolunteerDashboard({ requests }: { requests: EmergencyRequest[] }) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [updateNote, setUpdateNote] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter for tasks assigned to volunteers (in processing state)
  const activeRequests = requests.filter(r => r.status === 'processing');

  const handleCompleteTask = async (request: EmergencyRequest) => {
    try {
      setLoading(true);
      await updateRequestStatus(request.id, 'resolved');
      setSelectedTask(null);
      setUpdateNote('');
      setSelectedFiles(null);
    } catch (error) {
      console.error('Failed to update request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-700 dark:text-blue-300">Assigned Tasks</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Track your current assignments</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-medium text-green-700 dark:text-green-300">Training</h3>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Access volunteer training resources</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-medium text-purple-700 dark:text-purple-300">Community</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Connect with other volunteers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Assignments</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activeRequests.map((request) => (
              <div 
                key={request.id} 
                className={`p-4 cursor-pointer ${
                  selectedTask === request.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setSelectedTask(request.id)}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
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
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{request.text}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{request.location}</p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {activeRequests.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No active assignments at the moment
              </div>
            )}
          </div>
        </div>

        {/* Field Update Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Submit Field Update</h3>
          </div>
          <div className="p-4">
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const selectedRequest = activeRequests.find(r => r.id === selectedTask);
              if (selectedRequest) {
                handleCompleteTask(selectedRequest);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Update Type
                </label>
                <select 
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select update type...</option>
                  <option value="status">Status Update</option>
                  <option value="resource">Resource Request</option>
                  <option value="completion">Completion Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea 
                  rows={4}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Provide details about the current situation..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add Photos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload files</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          multiple
                          onChange={(e) => setSelectedFiles(e.target.files)}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedTask || loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
