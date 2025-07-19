import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, MenuItem
} from '@mui/material';
import api from '../utils/api';
import { useStore } from '../store';

function TransactionForm({ open, transaction = null, onClose, onSuccess }) {
  const accounts = useStore(state => state.accounts);

  const [form, setForm] = useState({
    date: '',
    accountId: '',
    category: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date ? transaction.date.split('T')[0] : '',
        accountId: transaction.accountId || '',
        category: transaction.category || '',
        amount: transaction.amount !== undefined ? String(transaction.amount) : '',
        description: transaction.description || '',
      });
    } else {
      setForm({ date: '', accountId: '', category: '', amount: '', description: '' });
    }
    setErrors({});
    setError('');
  }, [transaction, open]);

  function validate() {
    const errs = {};
    if (!form.date.trim()) errs.date = 'Date required';
    if (!form.accountId) errs.accountId = 'Account required';
    if (!form.category.trim()) errs.category = 'Category required';
    if (!form.amount.trim() || isNaN(parseFloat(form.amount))) errs.amount = 'Amount required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      };
      if (transaction && (transaction.id || transaction._id)) {
        await api.put(`/transactions/${transaction.id || transaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.date}
            helperText={errors.date}
            disabled={loading}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="accountId"
            label="Account"
            select
            value={form.accountId}
            onChange={e => setForm({ ...form, accountId: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.accountId}
            helperText={errors.accountId}
            disabled={loading}
            required
          >
            {accounts.map(acc => (
              <MenuItem key={acc.id || acc._id} value={acc.id || acc._id}>
                {acc.name} ({acc.type})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="category"
            label="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.category}
            helperText={errors.category}
            disabled={loading}
            required
          />
          <TextField
            name="amount"
            label="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            fullWidth
            margin="normal"
            type="number"
            error={!!errors.amount}
            helperText={errors.amount}
            disabled={loading}
            required
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            fullWidth
            margin="normal"
            disabled={loading}
            multiline
            rows={2}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving…' : transaction ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransactionForm;