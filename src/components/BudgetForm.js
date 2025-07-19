import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert
} from '@mui/material';
import api from '../utils/api';

const periods = ['monthly', 'annual'];

function BudgetForm({ open, budget = null, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      setForm({
        name: budget.name || '',
        category: budget.category || '',
        amount: budget.amount !== undefined ? String(budget.amount) : '',
        period: budget.period || 'monthly',
      });
    } else {
      setForm({ name: '', category: '', amount: '', period: 'monthly' });
    }
    setErrors({});
    setError('');
  }, [budget, open]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.category.trim()) errs.category = 'Category required';
    if (!form.amount.trim() || isNaN(parseInt(form.amount))) errs.amount = 'Amount required';
    if (!form.period) errs.period = 'Period required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, amount: parseInt(form.amount) };
      if (budget && budget.id) {
        await api.put(`/budgets/${budget.id}`, payload);
      } else {
        await api.post('/budgets', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{budget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Budget Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
            autoFocus
            required
          />
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
            name="period"
            label="Period"
            select
            value={form.period}
            onChange={e => setForm({ ...form, period: e.target.value })}
            fullWidth
            margin="normal"
            disabled={loading}
            required
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </TextField>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving…' : budget ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BudgetForm;