import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Upgrade from './pages/Upgrade';
import Login from './pages/Login';
import BreakupWizard from './components/BreakupWizard';
import HouseholdManager from './components/HouseholdManager';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/login" element={<Login />} />
          <Route path="/breakup" element={<BreakupWizard />} />
          <Route path="/household" element={<HouseholdManager />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
