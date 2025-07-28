import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useFetch } from '../hooks/useFetch';
import DashboardCharts from '../components/DashboardCharts';
import InvestmentWidgets from '../components/InvestmentWidgets';
import NetWorthWidget from '../components/NetWorthWidget';

function Dashboard() {
  const { data: chartData, loading: chartLoading } = useFetch('/transactions/chart', {
    initialData: [],
  });
  const { data: investments, loading: investLoading } = useFetch('/investments', {
    initialData: [],
  });

  const loading = chartLoading || investLoading;

  if (loading) {
    return (
      <Box
        textAlign='center'
        role='status'
        aria-live='polite'
        aria-label='Loading dashboard data'
      >
        <CircularProgress />
        <Typography variant='body2' mt={2} color='text.secondary'>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box my={4} component='main' role='main'>
      <Typography
        variant='h4'
        mb={2}
        component='h1'
        id='dashboard-heading'
      >
        Dashboard
      </Typography>

      <Box component='section' aria-labelledby='dashboard-heading'>
        <NetWorthWidget />

        <Box component='section' aria-label='Financial charts and data visualization'>
          <DashboardCharts data={chartData} />
        </Box>

        <Box component='section' aria-label='Investment information'>
          <InvestmentWidgets investments={investments} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
