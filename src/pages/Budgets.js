import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useStore } from '../store';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BudgetForm from '../components/BudgetForm';
import api from '../utils/api';

function Budgets() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: budgets, loading, error } = useFetch('/budgets', {
    initialData: [],
    dependencies: [refreshTrigger],
  });
  const setBudgets = useStore(state => state.setBudgets);

  useEffect(() => {
    if (budgets) setBudgets(budgets);
  }, [budgets, setBudgets]);

  function handleAddClick() {
    setEditBudget(null);
    setDialogOpen(true);
  }
  function handleEditClick(budget) {
    setEditBudget(budget);
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
      await api.delete(`/budgets/${deletingId}`);
      handleCloseDelete();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete budget');
      setDeleteLoading(false);
    }
  }

  if (loading)
    return (
      <Box textAlign="center">
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box maxWidth={600} mx="auto" my={4} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Budgets</Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick} sx={{ mb: 2 }}>
        Add Budget
      </Button>
      <List>
        {budgets.map(budget => (
          <ListItem
            key={budget.id}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(budget)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDelete(budget.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={<strong>{budget.name} ({budget.category})</strong>}
              secondary={`$${Number(budget.amount).toLocaleString()} / ${budget.period}`}
            />
          </ListItem>
        ))}
      </List>
      <BudgetForm
        open={dialogOpen}
        budget={editBudget}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this budget? This action cannot be undone.
          </DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={deleteLoading}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={deleteLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Budgets;