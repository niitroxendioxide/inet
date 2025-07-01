import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('travelToken');

  console.log('🔒 AdminGuard: Checking authentication');
  console.log('📍 Current location:', location.pathname);
  console.log('🎫 Token exists:', !!token);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!token) {
        console.log('❌ No token found, authentication failed');
        throw new Error('No token');
      }
      
      console.log('🔄 Fetching user data...');
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch user:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }

      const { data: userData } = await response.json();
      console.log('👤 User data received:', {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.name
      });
      return userData;
    },
    retry: 1
  });

  if (isLoading) {
    console.log('⏳ Loading user data...');
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('🚫 Authentication error:', error instanceof Error ? error.message : 'Unknown error');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!token || !user || user.role !== 'ADMIN') {
    console.log('🚷 Access denied:', {
      hasToken: !!token,
      hasUser: !!user,
      userRole: user?.role,
      requiredRole: 'ADMIN'
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Admin access granted for user:', user.name);
  return <>{children}</>;
};

export default AdminGuard; 