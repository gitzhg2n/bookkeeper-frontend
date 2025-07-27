import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Divider,
  Card,
  CardContent,
  Paper,
  Tooltip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AccountForm from '../components/AccountForm';
import api from '../utils/api';

function Accounts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteError, setDeleteError] = useState('');

  // Use refreshTrigger to refetch data when accounts are added/edited/deleted
  const { data: accounts, loading, error } = useFetch('/accounts', { 
    initialData: [],
    dependencies: [refreshTrigger], 
  });
  
  const setAccounts = useStore(state => state.setAccounts);

  useEffect(() => {
    if (accounts) setAccounts(accounts);
  }, [accounts, setAccounts]);

  const handleAddClick = () => {
    setEditAccount(null);
    setDialogOpen(true);
  };

  const handleEditClick = (account) => {
    setEditAccount(account);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account? This cannot be undone.')) {
      try {
        await api.delete(`/accounts/${accountId}`);
        // Refresh the accounts list
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        setDeleteError(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  const handleFormSuccess = () => {
    // Refresh the accounts list
    setRefreshTrigger(prev => prev + 1);
  };

  // Calculate total assets and liabilities
  const totals = accounts.reduce(
    (acc, account) => {
      const balance = account.balance || 0;
      if (['loan', 'credit card', 'liability'].includes(account.type?.toLowerCase())) {
        acc.liabilities += balance;
      } else {
        acc.assets += balance;
      }
      return acc;
    },
    { assets: 0, liabilities: 0 },
  );

  const netWorth = totals.assets - totals.liabilities;

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Accounts</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Account
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

      {/* Financial Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Financial Summary</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">Total Assets</Typography>
            <Typography variant="h5" color="primary">
              ${totals.assets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">Total Liabilities</Typography>
            <Typography variant="h5" color="error">
              ${totals.liabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary">Net Worth</Typography>
            <Typography variant="h5" color={netWorth >= 0 ? 'success' : 'error'}>
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Account List */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {accounts.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', gridColumn: '1 / -1' }}>
            <Typography>No accounts found. Add your first account to get started.</Typography>
          </Paper>
        ) : (
          accounts.map(acc => (
            <Card key={acc.id || acc._id} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {acc.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {acc.institution} • {acc.type}
                </Typography>
                <Typography variant="h5" color={
                  ['loan', 'credit card', 'liability'].includes(acc.type?.toLowerCase())
                    ? 'error'
                    : 'primary'
                }>
                  ${(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEditClick(acc)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDeleteClick(acc.id || acc._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          ))
        )}
      </Box>

      <AccountForm 
        open={dialogOpen} 
        account={editAccount}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}

export default Accounts;
