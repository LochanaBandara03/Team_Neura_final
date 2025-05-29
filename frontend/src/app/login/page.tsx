'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginCredentials } from '@/types/auth';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, error: authError, isLoading } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-up">
            {/* Logo animation */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-float">
                <svg 
                  className="w-8 h-8 text-white transform transition-transform hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Sign in to SafeBridge
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Access the emergency response platform
            </p>

            {(error || authError) && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 animate-fade-up">
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error || authError}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
