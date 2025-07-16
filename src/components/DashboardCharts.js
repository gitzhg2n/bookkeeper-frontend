import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function DashboardCharts({ data, title = "Spending Over Time" }) {
  if (!data || data.length === 0)
    return <Box my={2}><Paper elevation={1}><Typography p={2}>No chart data available.</Typography></Paper></Box>;

  return (
    <Box my={2}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default DashboardCharts;