'use client';

import { Task } from '@/types/dashboard';
import { useState } from 'react';

interface PriorityTaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onStatusUpdate: (taskId: string, status: Task['status']) => void;
  userRole: string;
}

export default function PriorityTaskList({ 
  tasks, 
  onTaskSelect, 
  onStatusUpdate,
  userRole 
}: PriorityTaskListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'in_progress'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => b.priority - a.priority);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Priority Tasks
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
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('assigned')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'assigned'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'in_progress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedTasks.map(task => (
          <div
            key={task.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onTaskSelect(task)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  task.priority > 7 ? 'bg-red-500' :
                  task.priority > 4 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <span className="font-semibold">Task #{task.id}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.status === 'pending' ? 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300' :
                task.status === 'assigned' ? 'bg-blue-200 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                'bg-green-200 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <p>Priority: {task.priority}/10</p>
              <p>Resources: {task.resources.length}</p>
            </div>

            {(userRole === 'first_responder' || userRole === 'government') && (
              <div className="flex space-x-2 mt-2">
                {task.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(task.id, 'assigned');
                    }}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Assign
                  </button>
                )}
                {task.status === 'assigned' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(task.id, 'in_progress');
                    }}
                    className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                  >
                    Start
                  </button>
                )}
                {task.status === 'in_progress' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(task.id, 'completed');
                    }}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 