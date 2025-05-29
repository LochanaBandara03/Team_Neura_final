'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AIChat from '@/components/AIChat';

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<'ai' | 'regular'>('ai');
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Chat Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 px-4 py-3 text-center font-medium ${
                activeTab === 'ai'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('regular')}
              className={`flex-1 px-4 py-3 text-center font-medium ${
                activeTab === 'regular'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Team Chat
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4">
            {activeTab === 'ai' ? (
              <AIChat />
            ) : (
              <div className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* TODO: Implement regular chat messages */}
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Team chat coming soon...
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
