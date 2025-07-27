import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert,
} from '@mui/material';
import api from '../utils/api';

function GoalForm({ open, goal = null, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    target: '',
    progress: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name || '',
        category: goal.category || '',
        target: goal.target !== undefined ? String(goal.target) : '',
        progress: goal.progress !== undefined ? String(goal.progress) : '',
        notes: goal.notes || '',
      });
    } else {
      setForm({ name: '', category: '', target: '', progress: '', notes: '' });
    }
    setErrors({});
    setError('');
  }, [goal, open]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.category.trim()) errs.category = 'Category required';
    if (!form.target.trim() || isNaN(parseFloat(form.target))) errs.target = 'Target required';
    if (!form.progress.trim() || isNaN(parseFloat(form.progress))) errs.progress = 'Progress required';
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
        target: parseFloat(form.target),
        progress: parseFloat(form.progress),
      };
      if (goal && (goal.id || goal._id)) {
        await api.put(`/goals/${goal.id || goal._id}`, payload);
      } else {
        await api.post('/goals', payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{goal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Goal Name"
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
            name="target"
            label="Target Amount"
            value={form.target}
            onChange={e => setForm({ ...form, target: e.target.value })}
            fullWidth
            margin="normal"
            type="number"
            error={!!errors.target}
            helperText={errors.target}
            disabled={loading}
            required
          />
          <TextField
            name="progress"
            label="Current Progress"
            value={form.progress}
            onChange={e => setForm({ ...form, progress: e.target.value })}
            fullWidth
            margin="normal"
            type="number"
            error={!!errors.progress}
            helperText={errors.progress}
            disabled={loading}
            required
          />
          <TextField
            name="notes"
            label="Notes"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
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
            {loading ? 'Saving…' : goal ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default GoalForm;