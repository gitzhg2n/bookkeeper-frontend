import React, { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';

function Budgets() {
  const { data: budgets, loading, error } = useFetch('/budgets', { initialData: [] });
  const setBudgets = useStore(state => state.setBudgets);

  useEffect(() => {
    if (budgets) setBudgets(budgets);
  }, [budgets, setBudgets]);

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box maxWidth={500} mx="auto" my={4} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>
        Budgets
      </Typography>
      <List>
        {budgets.map(budget => (
          <ListItem key={budget._id}>
            <ListItemText
              primary={budget.category}
              secondary={`$${budget.amount.toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Budgets;
