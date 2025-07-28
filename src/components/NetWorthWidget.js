import React, { useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Typography, Paper, CircularProgress, Box } from '@mui/material';

function NetWorthWidget() {
  // Fetch accounts and investments
  const { data: accounts = [], loading: accountsLoading } = useFetch('/accounts', {
    initialData: [],
  });
  const { data: investments = [], loading: investLoading } = useFetch('/investments', {
    initialData: [],
  });

  // Calculate net worth
  const netWorth = useMemo(() => {
    let assets = 0;
    let liabilities = 0;

    // Assume 'type' includes asset or liability (e.g., 'checking', 'loan', 'credit card')
    accounts.forEach(acc => {
      if (!acc || typeof acc.balance !== 'number') {
        return;
      }
      if (['loan', 'credit card', 'liability'].includes(acc.type?.toLowerCase())) {
        liabilities += acc.balance;
      } else {
        assets += acc.balance;
      }
    });

    // Add investments as assets
    investments.forEach(inv => {
      if (!inv || typeof inv.value !== 'number') {
        return;
      }
      assets += inv.value;
    });

    return assets - liabilities;
  }, [accounts, investments]);

  const isLoading = accountsLoading || investLoading;

  if (isLoading) {
    return (
      <Paper
        elevation={1}
        sx={{ p: 3, borderRadius: 2, mb: 2 }}
        role='status'
        aria-live='polite'
        aria-label='Loading net worth information'
      >
        <Box display='flex' alignItems='center' gap={2}>
          <CircularProgress size={20} />
          <Typography>Loading net worth...</Typography>
        </Box>
      </Paper>
    );
  }

  const formattedNetWorth = netWorth.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const isPositive = netWorth >= 0;

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, mb: 2 }}
      component='section'
      aria-labelledby='net-worth-heading'
    >
      <Typography id='net-worth-heading' variant='h6' mb={1}>
        Net Worth Overview
      </Typography>
      <Typography
        variant='h4'
        color={isPositive ? 'primary' : 'error'}
        role='text'
        aria-label={`Net worth: ${isPositive ? '' : 'negative '}$${formattedNetWorth}`}
      >
        ${formattedNetWorth}
      </Typography>
      <Typography variant='body2' mt={1} color='text.secondary'>
        Assets and investments minus debts and liabilities
      </Typography>
    </Paper>
  );
}

export default NetWorthWidget;
