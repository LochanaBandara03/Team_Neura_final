'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const publicPaths = ['/login', '/register', '/']; // Added register and home page as public paths

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = publicPaths.includes(pathname);

      // Clear any invalid user data from localStorage
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser.token || !parsedUser.role) {
            localStorage.removeItem('user');
            if (!isPublicPath) {
              router.push('/login');
            }
            return;
          }
        }
      } catch (err) {
        console.error('Error checking stored user:', err);
        localStorage.removeItem('user');
        if (!isPublicPath) {
          router.push('/login');
        }
        return;
      }

      if (!user && !isPublicPath) {
        // Redirect to login if trying to access protected route without auth
        router.push('/login');
      } else if (user && pathname === '/login') {
        // Only redirect from login page when authenticated
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show children only if authenticated or on public path
  if (publicPaths.includes(pathname) || user) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
