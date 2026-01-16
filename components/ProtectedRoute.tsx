import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import LoginComponent from './LoginComponent';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  
  if (!user) {
    return <LoginComponent />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;