import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationContext } from '../context/AuthenticationContext';

const ProtectedRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuthenticationContext();

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};
const NonAuthRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuthenticationContext();

  useEffect(() => {}, [isAuthenticated]);

  return !isAuthenticated ? children : <Navigate to={redirectTo} />;
};
const AdminProtectedRoute = ({ children, redirectTo }) => {
  const { isAdmin } = useAuthenticationContext();

  console.log('isAdmin', isAdmin);

  return isAdmin ? children : <Navigate to={redirectTo} />;
};

export { ProtectedRoute, NonAuthRoute, AdminProtectedRoute };
