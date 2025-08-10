import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { LoginPage } from './LoginPage'; // adjusted path (or move file into pages/ and revert)
function Dashboard() {
  // Temporarily stub out missing HouseholdsAccountsDemo
  return <div style={{ padding: 24 }}>Dashboard (stub – implement households/accounts UI)</div>;
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