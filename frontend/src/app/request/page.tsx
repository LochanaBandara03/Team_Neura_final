'use client';

import { useState } from 'react';
import { HelpRequest } from '@/types';
import { submitRequest, EmergencyRequest } from '@/services/api';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function RequestPage() {
  const router = useRouter();  const [formData, setFormData] = useState<HelpRequest>({
    fullName: '',
    location: '',
    description: '',
    urgency: 'Medium',
    type: 'Other',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [urgency, setUrgency] = useState<string>('');
  const [helpType, setHelpType] = useState<string>('');  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.fullName || !formData.location || !formData.description) {
        throw new Error('All required fields must be filled');
      }
        // Create a detailed message from form data
      const message = `Emergency help needed for ${formData.fullName} at ${formData.location}. Details: ${formData.description}`;
      console.log('Submitting request:', message, formData.urgency, formData.type);
      
      // Make the API call with urgency and type
      const response = await submitRequest(message, formData.urgency, formData.type);
      console.log('Response received:', response);
      
      // Set the response data for display
      setUrgency(response.urgency);
      setHelpType(response.type);
      setSubmitted(true);
      
      // Redirect to status page with request ID after a brief delay to show the response
      setTimeout(() => {
        router.push(`/dashboard?request=${response.id}`);
      }, 2000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit request');
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 animate-fade-up">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Submit Help Request
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Please provide details about your emergency situation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Street address, city, or coordinates"
              />
            </div>            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe your emergency situation"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Urgency Level *
                </label>
                <select
                  id="urgency"
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Help Type *
                </label>
                <select
                  id="type"
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="Medical">Medical</option>
                  <option value="Food">Food</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Evacuation">Evacuation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Upload Image (Optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })}
              />
            </div>          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center group ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Response Section */}
          {submitted && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fade-up">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Request Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-24">Urgency:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    urgency === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {urgency}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-24">Help Type:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {helpType}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-24">Location:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formData.location}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>    </main>
    </>
  );
}
