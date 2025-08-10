import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import { HouseholdsAccountsDemo } from './pages/HouseholdsAccountsDemo';

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome, {user.email}</h1>
      <button onClick={logout}>Logout</button>
      <HouseholdsAccountsDemo />
    </div>
  );
}

function Root() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ErrorBoundary>
  );
}