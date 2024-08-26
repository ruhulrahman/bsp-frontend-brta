import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = ({ element }) => {
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = true

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
