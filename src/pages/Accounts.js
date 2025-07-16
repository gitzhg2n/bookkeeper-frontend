import React, { useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

function Accounts() {
  const { data: accounts, loading, error } = useFetch('/accounts', { initialData: [] });
  const setAccounts = useStore(state => state.setAccounts);

  useEffect(() => {
    if (accounts) setAccounts(accounts);
  }, [accounts, setAccounts]);

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box maxWidth={500} mx="auto" my={4} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Accounts</Typography>
      <List>
        {accounts.map(acc => (
          <ListItem key={acc._id}>
            <ListItemText
              primary={<strong>{acc.name}</strong>}
              secondary={`${acc.type} - $${acc.balance.toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Accounts;