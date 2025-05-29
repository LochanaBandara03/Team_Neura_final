'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, registerVolunteer } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); // Step 1: Account, Step 2: Role & Location, Step 3: Experience
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'affected_individual', // Default to affected individual (person in need)
    location: '',
    experience: '',
    specialties: [] as string[],
    availability: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [locationError, setLocationError] = useState(false);
  
  const specialtiesList = [
    'Medical', 
    'Search & Rescue', 
    'Firefighting',
    'Communication', 
    'Logistics', 
    'Transportation', 
    'Mental Health', 
    'Childcare', 
    'Elder Care',
    'Technical (Electricity/Water/Gas)', 
    'Foreign Languages', 
    'Food Distribution'
  ];
  
  const handleSpecialtyChange = (specialty: string) => {
    if (formData.specialties.includes(specialty)) {
      setFormData({
        ...formData,
        specialties: formData.specialties.filter(s => s !== specialty)
      });
    } else {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialty]
      });
    }
  };
  const validateStep = () => {
    switch(step) {
      case 1:
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('All fields are required');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      case 2:
        if (!formData.location) {
          setLocationError(true);
          setError('Location is required');
          return false;
        }
        if (!termsAccepted) {
          setError('You must agree to the Terms of Service and Privacy Policy');
          return false;
        }
        break;
      case 3:
        // For first responders and volunteers, require specialties and availability
        if ((formData.role === 'first_responder' || formData.role === 'volunteer')) {
          if (formData.specialties.length === 0) {
            setError('Please select at least one specialty');
            return false;
          }
          if (!formData.availability) {
            setError('Please select your availability');
            return false;
          }
          if (!formData.experience || formData.experience.trim().length < 10) {
            setError('Please provide a description of your relevant experience (minimum 10 characters)');
            return false;
          }
        }
        break;
    }
    setError(null);
    return true;
  };
  
  const handleContinue = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Log the registration attempt
      console.log('Submitting registration with data:', {
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        location: formData.location
      });
      
      // First register the user account
      const authResponse = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        location: formData.location
      });
      
      if (!authResponse || !authResponse.token) {
        throw new Error('Registration failed - no auth token received');
      }
      
      console.log('Registration successful, auth response:', authResponse);
      
      try {
        // Then register volunteer/responder information if the user is not an affected individual
        if (formData.role === 'volunteer' || formData.role === 'first_responder') {
          const volunteerData = {
            email: formData.email,
            name: formData.fullName,
            role: formData.role,
            specialties: formData.specialties,
            availability: formData.availability,
            experience: formData.experience,
            location: formData.location
          };
          
          console.log('Submitting volunteer/responder information:', volunteerData);
          const volunteerResponse = await registerVolunteer(volunteerData);
          console.log('Volunteer/responder registration successful:', volunteerResponse);
        }
      } catch (volunteerErr) {
        // Continue even if volunteer registration fails, since user account is created
        console.error('Volunteer/responder info registration error:', volunteerErr);
      }
      
      // Store the user in local storage manually for instant login
      const newUser = {
        email: formData.email,
        fullName: authResponse.fullName,
        token: authResponse.token,
        role: authResponse.role
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        // Redirect to dashboard
        router.push('/dashboard');
      }, 100);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again or use a different email.');
    } finally {
      setLoading(false);
    }
  };
    const renderStepIndicator = () => (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto mb-8">
      {/* Track 1: Account */}
      <div className="flex flex-col items-center w-1/3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
          ${step === 1 
            ? 'bg-blue-600 text-white' 
            : step > 1 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
        >
          {step > 1 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>1</span>
          )}
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Account</span>
      </div>
      
      {/* Line 1-2 */}
      <div className={`h-0.5 flex-1 ${step > 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
      
      {/* Track 2: Role & Location */}
      <div className="flex flex-col items-center w-1/3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
          ${step === 2 
            ? 'bg-blue-600 text-white' 
            : step > 2 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
        >
          {step > 2 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>2</span>
          )}
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Role & Location</span>
      </div>
      
      {/* Line 2-3 */}
      <div className={`h-0.5 flex-1 ${step > 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
      
      {/* Track 3: Experience */}
      <div className="flex flex-col items-center w-1/3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
          ${step === 3 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
        >
          <span>3</span>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Experience</span>
      </div>
    </div>
  );
    return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-up">
            <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Create Your SafeBridge Account
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Join our community to help connect during emergencies
            </p>
            
            {renderStepIndicator()}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
              <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
              {/* Step 1: Account Information */}
              {step === 1 && (
                <div className="space-y-4">                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      />
                    </div>
                  </div>
                    <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
                {/* Step 2: Role & Location */}
              {step === 2 && (
                <div className="space-y-6">                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      I am registering as: *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="relative">
                        <input 
                          type="radio" 
                          id="role-individual" 
                          name="role" 
                          className="peer hidden" 
                          checked={formData.role === 'affected_individual'} 
                          onChange={() => setFormData({...formData, role: 'affected_individual'})}
                        />
                        <label 
                          htmlFor="role-individual" 
                          className={`flex flex-col items-start p-4 border rounded-lg cursor-pointer transition shadow-sm hover:shadow-md ${
                            formData.role === 'affected_individual' 
                              ? 'bg-indigo-50 dark:bg-blue-900/20 border-blue-500' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex mb-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              formData.role === 'affected_individual' ? 'bg-blue-500' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                            }`}>
                              {formData.role === 'affected_individual' && (
                                <div className="h-3 w-3 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="ml-2 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Person in Need</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            I might need assistance during emergencies
                          </span>
                        </label>
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="radio" 
                          id="role-responder" 
                          name="role" 
                          className="peer hidden" 
                          checked={formData.role === 'first_responder'} 
                          onChange={() => setFormData({...formData, role: 'first_responder'})}
                        />
                        <label 
                          htmlFor="role-responder" 
                          className={`flex flex-col items-start p-4 border rounded-lg cursor-pointer transition shadow-sm hover:shadow-md ${
                            formData.role === 'first_responder' 
                              ? 'bg-indigo-50 dark:bg-blue-900/20 border-blue-500' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex mb-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              formData.role === 'first_responder' ? 'bg-blue-500' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                            }`}>
                              {formData.role === 'first_responder' && (
                                <div className="h-3 w-3 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="ml-2 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">First Responder</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            I have professional training as a first responder
                          </span>
                        </label>
                      </div>
                      
                      <div className="relative">
                        <input 
                          type="radio" 
                          id="role-volunteer" 
                          name="role" 
                          className="peer hidden" 
                          checked={formData.role === 'volunteer'} 
                          onChange={() => setFormData({...formData, role: 'volunteer'})}
                        />
                        <label 
                          htmlFor="role-volunteer" 
                          className={`flex flex-col items-start p-4 border rounded-lg cursor-pointer transition shadow-sm hover:shadow-md ${
                            formData.role === 'volunteer' 
                              ? 'bg-indigo-50 dark:bg-blue-900/20 border-blue-500' 
                              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex mb-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              formData.role === 'volunteer' ? 'bg-blue-500' : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                            }`}>
                              {formData.role === 'volunteer' && (
                                <div className="h-3 w-3 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div className="ml-2 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">Volunteer</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            I can provide assistance during emergencies
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                    <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Location *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({...formData, location: e.target.value});
                          setLocationError(false);
                        }}
                        className={`w-full rounded-lg border ${locationError ? 'border-red-500 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} pl-10 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow`}
                        placeholder="City, State/Province, Country"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      This helps us match you with nearby emergencies or resources
                    </p>
                    {locationError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Please fill out this field.
                      </p>
                    )}
                  </div>
                    {!termsAccepted && (
                    <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800 rounded-lg animate-pulse">
                      <p className="text-red-700 dark:text-red-400 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        You must agree to the Terms of Service and Privacy Policy
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Back
                    </button>                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.location) {
                          setLocationError(true);
                          return;
                        }
                        handleContinue();
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-8 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Sign in</Link>
                    </p>
                  </div>
                </div>
              )}                {/* Step 3: Experience */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Relevant Experience {formData.role !== 'affected_individual' && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                      id="experience"
                      rows={5}
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      className={`w-full rounded-lg border ${!formData.experience && formData.role !== 'affected_individual' ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none`}
                      placeholder="Please describe your relevant experience or training..."
                    />
                    {formData.role !== 'affected_individual' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Please provide details about your experience, certifications, or training related to emergency response.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Specialties (Select all that apply) {formData.role !== 'affected_individual' && <span className="text-red-600">*</span>}
                    </label>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-4 rounded-lg ${formData.specialties.length === 0 && formData.role !== 'affected_individual' ? 'border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}>
                      {specialtiesList.map(specialty => (
                        <div key={specialty} className="flex items-center">
                          <input
                            id={specialty.toLowerCase().replace(/\s+/g, '-')}
                            type="checkbox"
                            checked={formData.specialties.includes(specialty)}
                            onChange={() => handleSpecialtyChange(specialty)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={specialty.toLowerCase().replace(/\s+/g, '-')} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            {specialty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Availability {formData.role !== 'affected_individual' && <span className="text-red-600">*</span>}
                    </label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                      className={`w-full rounded-lg border ${!formData.availability && formData.role !== 'affected_individual' ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow`}
                    >
                      <option value="">Select your availability</option>
                      <option value="On-call (24/7)">On-call (24/7)</option>
                      <option value="Evenings & Weekends">Evenings & Weekends</option>
                      <option value="Weekends only">Weekends only</option>
                      <option value="Daytime hours">Daytime hours</option>
                      <option value="Remote only">Remote only</option>
                    </select>
                  </div>
                    <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-8 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 shadow-lg"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : 'Complete Registration'}
                    </button>
                  </div>
                  
                  <div className="text-center mt-6">
                    <p className="text-gray-600 dark:text-gray-400">
                      Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Sign in</Link>
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
