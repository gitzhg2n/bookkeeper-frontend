import React from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthGate({ children, fallback = null }) {
  const { isAuthenticated, loadingUser } = useAuth();
  if (loadingUser) return <div>Loading...</div>;
  if (!isAuthenticated) return fallback;
  return children;
}