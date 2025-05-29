'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '@/types/auth';
import { login as apiLogin } from '@/services/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Validate user data
          if (parsedUser.token && parsedUser.role && parsedUser.email) {
            setUser(parsedUser);
          } else {
            // Clear invalid user data
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error loading user from localStorage:', err);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiLogin(credentials);
      
      // Validate response
      if (!response.token || !response.role) {
        throw new Error('Invalid login response');
      }

      const newUser = {
        email: credentials.email,
        ...response
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
