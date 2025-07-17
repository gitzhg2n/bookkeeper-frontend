import React, { useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Box, Typography, Paper } from '@mui/material';

function NetWorthWidget() {
  // Fetch accounts and investments
  const { data: accounts = [], loading: accountsLoading } = useFetch('/accounts', { initialData: [] });
  const { data: investments = [], loading: investLoading } = useFetch('/investments', { initialData: [] });

  // Calculate net worth
  const netWorth = useMemo(() => {
    let assets = 0;
    let liabilities = 0;

    // Assume 'type' includes asset or liability (e.g., 'checking', 'loan', 'credit card')
    accounts.forEach(acc => {
      if (!acc || typeof acc.balance !== 'number') return;
      if (['loan', 'credit card', 'liability'].includes(acc.type?.toLowerCase())) {
        liabilities += acc.balance;
      } else {
        assets += acc.balance;
      }
    });

    // Add investments as assets
    investments.forEach(inv => {
      if (!inv || typeof inv.value !== 'number') return;
      assets += inv.value;
    });

    return assets - liabilities;
  }, [accounts, investments]);

  if (accountsLoading || investLoading) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
        <Typography>Loading net worth...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" mb={1}>
        Net Worth Overview
      </Typography>
      <Typography variant="h4" color={netWorth >= 0 ? 'primary' : 'error'}>
        ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </Typography>
      <Typography variant="body2" mt={1}>
        Assets and investments minus debts and liabilities
      </Typography>
    </Paper>
  );
}

export default NetWorthWidget;