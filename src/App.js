import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HouseholdProvider } from './context/HouseholdContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import HouseholdsPage from './pages/Households';
import AccountsPage from './pages/Accounts';
import CategoriesPage from './pages/Categories';
import BudgetsPage from './pages/Budgets';
import TransactionsPage from './pages/Transactions';
import InvestmentAlerts from './pages/InvestmentAlerts';
import NotificationCenter from './pages/NotificationCenter';
import NotificationPreferences from './pages/NotificationPreferences';
import PasswordResetPage from './pages/PasswordResetPage';
import OnboardingPage from './pages/OnboardingPage';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import NavBar from './components/NavBar';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <HouseholdProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/households" element={<HouseholdsPage />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/alerts" element={<InvestmentAlerts />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/notification-preferences" element={<NotificationPreferences />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset" element={<PasswordResetPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </Layout>
    </HouseholdProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavBar />
        <AppRoutes />
      </AuthProvider>
    </ErrorBoundary>
  );
}
