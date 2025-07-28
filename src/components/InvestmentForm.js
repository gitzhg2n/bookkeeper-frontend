import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import api from '../utils/api';

function InvestmentForm({ open, investment = null, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    value: '',
    type: '',
    institution: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (investment) {
      setForm({
        name: investment.name || '',
        value: investment.value !== undefined ? String(investment.value) : '',
        type: investment.type || '',
        institution: investment.institution || '',
      });
    } else {
      setForm({ name: '', value: '', type: '', institution: '' });
    }
    setErrors({});
    setError('');
  }, [investment, open]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = 'Name required';
    }
    if (!form.value.trim() || isNaN(parseFloat(form.value))) {
      errs.value = 'Value required';
    }
    if (!form.type.trim()) {
      errs.type = 'Type required';
    }
    if (!form.institution.trim()) {
      errs.institution = 'Institution required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, value: parseFloat(form.value) };
      if (investment && (investment.id || investment._id)) {
        await api.put(`/investments/${investment.id || investment._id}`, payload);
      } else {
        await api.post('/investments', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save investment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{investment ? 'Edit Investment' : 'Add New Investment'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name='name'
            label='Investment Name'
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            fullWidth
            margin='normal'
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading}
            autoFocus
            required
          />
          <TextField
            name='type'
            label='Type'
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            fullWidth
            margin='normal'
            error={!!errors.type}
            helperText={errors.type}
            disabled={loading}
            required
          />
          <TextField
            name='value'
            label='Value'
            value={form.value}
            onChange={e => setForm({ ...form, value: e.target.value })}
            fullWidth
            margin='normal'
            type='number'
            error={!!errors.value}
            helperText={errors.value}
            disabled={loading}
            required
          />
          <TextField
            name='institution'
            label='Institution'
            value={form.institution}
            onChange={e => setForm({ ...form, institution: e.target.value })}
            fullWidth
            margin='normal'
            error={!!errors.institution}
            helperText={errors.institution}
            disabled={loading}
            required
          />
          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' color='primary' disabled={loading}>
            {loading ? 'Saving…' : investment ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default InvestmentForm;
