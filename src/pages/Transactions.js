import React, { useEffect } from 'react';
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
} from '@mui/material';

function Transactions() {
  const { data: transactions, loading, error } = useFetch('/transactions', { initialData: [] });
  const setTransactions = useStore(state => state.setTransactions);

  useEffect(() => {
    if (transactions) setTransactions(transactions);
  }, [transactions, setTransactions]);

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box my={4}>
      <Typography variant="h5" mb={2}>
        Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(tx => (
              <TableRow key={tx._id}>
                <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell>{tx.account?.name || tx.account}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell>${tx.amount}</TableCell>
                <TableCell>{tx.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Transactions;
