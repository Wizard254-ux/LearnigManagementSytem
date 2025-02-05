import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = () => {
  const { logout } = useAuth();
  const isAuthenticated = localStorage.getItem('user') !== null;

  // If not authenticated, trigger logout and redirect
  useEffect(() => {
    if (!isAuthenticated) {
      logout(); // Call logout function
    }
  }, [isAuthenticated, logout]);

  // If authenticated, render the child routes (Outlet)
  // If not authenticated, redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
