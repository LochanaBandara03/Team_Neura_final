'use client';

import { useState } from 'react';
import { EmergencyRequest } from '@/services/api';

export default function GovernmentDashboard({ requests }: { requests: EmergencyRequest[] }) {
  const [timeRange, setTimeRange] = useState('24h');

  // Calculate statistics
  const activeRequests = requests.filter(r => r.status === 'pending' || r.status === 'processing');
  const resolvedRequests = requests.filter(r => r.status === 'resolved');

  const requestsByType = {
    Medical: requests.filter(r => r.type === 'Medical').length,
    Food: requests.filter(r => r.type === 'Food').length,
    Shelter: requests.filter(r => r.type === 'Shelter').length,
    Evacuation: requests.filter(r => r.type === 'Evacuation').length,
    Other: requests.filter(r => r.type === 'Other').length,
  };

  const totalRequests = requests.length;
  const getTypePercentage = (type: keyof typeof requestsByType) => {
    return totalRequests > 0 ? Math.round((requestsByType[type] / totalRequests) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-blue-600 dark:text-blue-400">Active Cases</p>
          <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
            {activeRequests.length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <p className="text-sm text-green-600 dark:text-green-400">Available Responders</p>
          <p className="text-2xl font-semibold text-green-700 dark:text-green-300">24</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Resource Utilization</p>
          <p className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300">78%</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <p className="text-sm text-purple-600 dark:text-purple-400">Response Time</p>
          <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300">12m</p>
        </div>
      </div>

      {/* Resource Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resource Allocation</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Medical Teams</span>
                  <span>15/20 Deployed</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Emergency Vehicles</span>
                  <span>8/10 Active</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Relief Supplies</span>
                  <span>60% Remaining</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Incident Overview</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Medical Emergencies</span>
                <span className="text-red-600 dark:text-red-400 font-medium">{getTypePercentage('Medical')}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Food & Water</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{getTypePercentage('Food')}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shelter</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">{getTypePercentage('Shelter')}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Evacuations</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">{getTypePercentage('Evacuation')}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Other</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">{getTypePercentage('Other')}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Settings</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alert Threshold
              </label>
              <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option>High Priority Only</option>
                <option>Medium and High</option>
                <option>All Priorities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Resource Auto-Assignment
              </label>
              <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                <option>Enabled</option>
                <option>Manual Approval</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
