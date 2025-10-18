import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute check:', {
    isAuthenticated,
    user,
    requiredRoles: roles,
    currentPath: location.pathname
  });

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (Array.isArray(roles) && roles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      console.log('❌ Access denied. User roles:', userRoles, 'Required roles:', roles);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;




