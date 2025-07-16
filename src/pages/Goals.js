import React, { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, LinearProgress } from '@mui/material';

function Goals() {
  const { data: goals, loading, error } = useFetch('/goals', { initialData: [] });

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box maxWidth={500} mx="auto" my={4} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Goals</Typography>
      <List>
        {goals.map(goal => (
          <ListItem key={goal._id}>
            <ListItemText
              primary={goal.name}
              secondary={
                <>
                  Target: ${goal.target.toLocaleString()} &mdash; Progress: ${goal.progress.toLocaleString()}
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (goal.progress / goal.target) * 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Goals;