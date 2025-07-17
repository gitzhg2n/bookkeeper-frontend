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
  IconButton,
  Stack,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    type: 'W-2',
    amount: '',
    frequency: 'monthly',
    notes: '',
  });
  const [submitError, setSubmitError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (sources) setIncomeSources(sources);
  }, [sources, setIncomeSources]);

  function handleOpenAdd() {
    setForm({
      name: '',
      type: 'W-2',
      amount: '',
      frequency: 'monthly',
      notes: '',
    });
    setEditMode(false);
    setEditingId(null);
    setDialogOpen(true);
    setSubmitError('');
  }

  function handleOpenEdit(src) {
    setForm({
      name: src.name || '',
      type: src.type || 'W-2',
      amount: src.amount !== undefined ? String(src.amount) : '',
      frequency: src.frequency || 'monthly',
      notes: src.notes || '',
    });
    setEditMode(true);
    setEditingId(src.id);
    setDialogOpen(true);
    setSubmitError('');
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setEditMode(false);
    setEditingId(null);
    setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    try {
      // Assume householdId is available in the first income source, or set a default (TODO: multi-household support)
      const householdId = sources[0]?.householdId || 1;
      const payload = {
        ...form,
        amount: parseFloat(form.amount || 0),
        householdId,
      };
      if (editMode && editingId) {
        await api.put(`/incomeSources/${editingId}`, payload);
      } else {
        await api.post('/incomeSources', payload);
      }
      handleCloseDialog();
      // Refresh the list without reload
      const updated = await api.get('/incomeSources');
      setIncomeSources(updated.data);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to save income source');
    }
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
      await api.delete(`/incomeSources/${deletingId}`);
      handleCloseDelete();
      // Refresh the list without reload
      const updated = await api.get('/incomeSources');
      setIncomeSources(updated.data);
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete income source');
      setDeleteLoading(false);
    }
  }

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>
        Income Sources
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenAdd} sx={{ mb: 2 }}>
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
          <ListItem
            key={src.id}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(src)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDelete(src.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={`${src.name} (${src.type})`}
              secondary={
                <>
                  ${parseFloat(src.amount).toLocaleString()} / {src.frequency}
                  {src.notes ? ` – ${src.notes}` : ''}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Income Source' : 'Add Income Source'}</DialogTitle>
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
              autoFocus
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">{editMode ? 'Save' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Income Source</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this income source? This action cannot be undone.
          </DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={deleteLoading}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default IncomeSources;