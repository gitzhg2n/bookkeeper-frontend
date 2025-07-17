import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store';
import api from '../utils/api';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';

const incomeTypes = [
  { value: 'W-2', label: 'W-2 (Employee)' },
  { value: '1099', label: '1099 (Contractor)' },
  { value: 'K-1', label: 'K-1 (Partnership)' },
  { value: 'Other', label: 'Other' },
];

function IncomeSources() {
  const { data: sources, loading, error } = useFetch('/incomeSources', { initialData: [] });
  const setIncomeSources = useStore(state => state.setIncomeSources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'W-2',
    amount: '',
    frequency: 'monthly',
    notes: '',
  });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (sources) setIncomeSources(sources);
  }, [sources, setIncomeSources]);

  function handleOpen() {
    setForm({
      name: '',
      type: 'W-2',
      amount: '',
      frequency: 'monthly',
      notes: '',
    });
    setDialogOpen(true);
    setSubmitError('');
  }

  function handleClose() {
    setDialogOpen(false);
    setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      // Assume householdId is available in the first income source, or set a default (TODO: fix for multi-household)
      const householdId = sources[0]?.householdId || 1;
      await api.post('/incomeSources', { ...form, amount: parseFloat(form.amount || 0), householdId });
      handleClose();
      window.location.reload(); // For now, reload; later, refresh state only
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to add income source');
    }
  }

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>
        Income Sources
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Add Income Source
      </Button>
      {loading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {sources.map(src => (
          <ListItem key={src.id}>
            <ListItemText
              primary={`${src.name} (${src.type})`}
              secondary={`$${parseFloat(src.amount).toLocaleString()} / ${src.frequency}${src.notes ? ' - ' + src.notes : ''}`}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Add Income Source</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              fullWidth
              margin="dense"
            />
            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              required
              fullWidth
              margin="dense"
            >
              {incomeTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
              fullWidth
              margin="dense"
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              select
              label="Frequency"
              name="frequency"
              value={form.frequency}
              onChange={e => setForm({ ...form, frequency: e.target.value })}
              required
              fullWidth
              margin="dense"
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="annual">Annual</MenuItem>
            </TextField>
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              fullWidth
              margin="dense"
              multiline
              rows={2}
            />
            {submitError && <Alert severity="error" sx={{ mt: 2 }}>{submitError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default IncomeSources;