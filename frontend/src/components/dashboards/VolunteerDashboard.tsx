'use client';

import { useState, useEffect } from 'react';
import { EmergencyRequest, updateRequestStatus } from '@/services/api';

export default function VolunteerDashboard({ requests }: { requests: EmergencyRequest[] }) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [updateNote, setUpdateNote] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [voiceNote, setVoiceNote] = useState<File | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: string; message: string; time: string }[]>([]);
  const [weather, setWeather] = useState<string>('');

  // Priority: sort by urgency (High > Medium > Low > Unknown)
  const urgencyOrder = { High: 3, Medium: 2, Low: 1, Unknown: 0 };
  const priorityRequests = [...requests].sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);

  // Assigned requests (simulate with status 'processing')
  const assignedRequests = requests.filter(r => r.status === 'processing');

  // Simulate weather fetch
  useEffect(() => {
    setWeather('🌤️ 27°C, Light Breeze');
  }, []);

  // Get user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert('Could not get location')
      );
    } else {
      alert('Geolocation not supported');
    }
  };

  // Simulate chat send
  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChatLog([...chatLog, { sender: 'You', message: chatMessage, time: new Date().toLocaleTimeString() }]);
      setChatMessage('');
    }
  };

  // Simulate voice note (UI only)
  const handleRecordVoice = () => {
    alert('Voice recording feature coming soon!');
  };

  // Simulate map markers
  const mapMarkers = requests.map(r => ({
    id: r.id,
    type: 'request',
    position: r.location,
    title: r.type,
    description: r.text,
    priority: urgencyOrder[r.urgency]
  }));

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
    <div className="space-y-8">
      {/* Weather and Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col items-center">
          <div className="text-2xl mb-2">Weather</div>
          <div className="text-lg">{weather}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="text-2xl mb-2">Affected Areas Map</div>
          {/* Placeholder for Map component */}
          <div className="h-48 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center text-blue-600">Map Visuals Here</div>
        </div>
      </div>

      {/* Priority List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Priority Task List</h3>
          <span className="text-xs text-gray-500">(Sorted by urgency)</span>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {priorityRequests.map((request) => (
            <div
              key={request.id}
              className={`p-4 flex items-center justify-between cursor-pointer ${
                selectedTask === request.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setSelectedTask(request.id)}
            >
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                  request.urgency === 'High'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : request.urgency === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {request.urgency}
                </span>
                <span className="font-semibold">{request.type}</span>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{request.text}</span>
              </div>
              <div>
                {assignedRequests.some(r => r.id === request.id) ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">Assigned</span>
                ) : (
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    onClick={e => { e.stopPropagation(); setSelectedTask(request.id); }}
                  >
                    Accept Task
                  </button>
                )}
              </div>
            </div>
          ))}
          {priorityRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No tasks at the moment
            </div>
          )}
        </div>
      </div>

      {/* Assigned Requests & Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assigned Requests & Tracking</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {assignedRequests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{request.type}</span>
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{request.text}</span>
                  <span className="ml-2 text-xs text-gray-500">({request.status})</span>
                </div>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  onClick={() => setSelectedTask(request.id)}
                >
                  Track
                </button>
              </div>
              {/* Show updates for this request (placeholder) */}
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Current updates and status will appear here.</div>
            </div>
          ))}
          {assignedRequests.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No assigned requests
            </div>
          )}
        </div>
      </div>

      {/* Reporting Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Report / Send Update</h3>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            onClick={handleGetLocation}
          >
            {location ? 'Location Attached' : 'Use My Location'}
          </button>
        </div>
        <div className="p-4">
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Report submitted!'); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Text Update</label>
              <textarea
                rows={3}
                value={updateNote}
                onChange={e => setUpdateNote(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe the situation..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setSelectedFiles(e.target.files)}
                className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Voice Note</label>
              <button
                type="button"
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                onClick={handleRecordVoice}
              >
                Record Voice Note
              </button>
              {voiceNote && <span className="ml-2 text-xs text-gray-500">Voice note attached</span>}
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Volunteer Chat</h3>
        </div>
        <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
          {chatLog.map((msg, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-semibold">{msg.sender}:</span> {msg.message} <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white px-3 py-2 text-sm"
            placeholder="Type a message..."
          />
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={handleSendChat}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
