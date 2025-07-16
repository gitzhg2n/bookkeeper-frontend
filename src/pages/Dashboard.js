import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { Box, Typography, CircularProgress } from '@mui/material';
import DashboardCharts from '../components/DashboardCharts';
import InvestmentWidgets from '../components/InvestmentWidgets';

function Dashboard() {
  const { data: chartData, loading: chartLoading } = useFetch('/transactions/chart', {
    initialData: [],
  });
  const { data: investments, loading: investLoading } = useFetch('/investments', {
    initialData: [],
  });

  const loading = chartLoading || investLoading;

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box my={4}>
      <Typography variant="h4" mb={2}>
        Dashboard
      </Typography>
      <DashboardCharts data={chartData} />
      <InvestmentWidgets investments={investments} />
    </Box>
  );
}

export default Dashboard;
