import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TransactionForm from '../components/TransactionForm';
import api from '../utils/api';

function Transactions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: transactions,
    loading,
    error,
  } = useFetch('/transactions', {
    initialData: [],
    dependencies: [refreshTrigger],
  });
  const setTransactions = useStore(state => state.setTransactions);

  useEffect(() => {
    if (transactions) {
      setTransactions(transactions);
    }
  }, [transactions, setTransactions]);

  function handleAddClick() {
    setEditTx(null);
    setDialogOpen(true);
  }
  function handleEditClick(tx) {
    setEditTx(tx);
    setDialogOpen(true);
  }
  function handleFormSuccess() {
    setRefreshTrigger(prev => prev + 1);
  }
  function handleOpenDelete(id) {
    setDeletingId(id);
    setDeleteDialogOpen(true);
    setDeleteError('');
  }
  function handleCloseDelete() {
    setDeleteDialogOpen(false);
    setDeletingId(null);
    setDeleteError('');
    setDeleteLoading(false);
  }
  async function handleConfirmDelete() {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await api.delete(`/transactions/${deletingId}`);
      handleCloseDelete();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete transaction');
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <Box textAlign='center'>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity='error'>{error}</Alert>;
  }

  return (
    <Box my={4}>
      <Typography variant='h5' mb={2}>
        Transactions
      </Typography>
      <Button
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        sx={{ mb: 2 }}
      >
        Add Transaction
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(tx => (
              <TableRow key={tx.id}>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.account?.name || tx.account}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell>${tx.amount}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell align='right'>
                  <Stack direction='row' spacing={1}>
                    <IconButton size='small' aria-label='edit' onClick={() => handleEditClick(tx)}>
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                      size='small'
                      aria-label='delete'
                      onClick={() => handleOpenDelete(tx.id)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TransactionForm
        open={dialogOpen}
        transaction={editTx}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            color='error'
            variant='contained'
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Transactions;
