// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { useUser } from '../context/UserContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useUser();
  console.log(`Hi arpan ProtectedRoute ${isAuthenticated}`)
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
