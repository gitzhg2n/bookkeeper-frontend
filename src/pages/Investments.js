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

function Investments() {
  const { data: investments, loading, error } = useFetch('/investments', { initialData: [] });
  const setInvestments = useStore(state => state.setInvestments);

  useEffect(() => {
    if (investments) setInvestments(investments);
  }, [investments, setInvestments]);

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
        Investments
      </Typography>
      <List>
        {investments.map(inv => (
          <ListItem key={inv._id}>
            <ListItemText
              primary={inv.name}
              secondary={`$${inv.value.toLocaleString()} (${inv.type})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Investments;
