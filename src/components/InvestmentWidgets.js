import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

function InvestmentWidgets({ investments }) {
  if (!investments || investments.length === 0) {
    return (
      <Box my={2}>
        <Paper elevation={1}>
          <Typography p={2}>No investments found.</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} my={2}>
      {investments.map(inv => (
        <Grid item xs={12} sm={6} md={4} key={inv.id}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant='subtitle1'>{inv.name}</Typography>
            <Typography>Value: ${inv.value.toLocaleString()}</Typography>
            <Typography>
              Change:{' '}
              <span style={{ color: inv.change >= 0 ? 'green' : 'red' }}>{inv.change}%</span>
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default InvestmentWidgets;
