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
import InvestmentForm from '../components/InvestmentForm';
import api from '../utils/api';

function Investments() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editInvestment, setEditInvestment] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: investments, loading, error } = useFetch('/investments', {
    initialData: [],
    dependencies: [refreshTrigger],
  });
  const setInvestments = useStore(state => state.setInvestments);

  useEffect(() => {
    if (investments) setInvestments(investments);
  }, [investments, setInvestments]);

  function handleAddClick() {
    setEditInvestment(null);
    setDialogOpen(true);
  }
  function handleEditClick(inv) {
    setEditInvestment(inv);
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
      await api.delete(`/investments/${deletingId}`);
      handleCloseDelete();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete investment');
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
      <Typography variant="h5" mb={2}>Investments</Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick} sx={{ mb: 2 }}>
        Add Investment
      </Button>
      <List>
        {investments.map(inv => (
          <ListItem
            key={inv.id}
            secondaryAction={
              <Stack direction="row" spacing={1}>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(inv)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDelete(inv.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={inv.name}
              secondary={`$${inv.value.toLocaleString()} (${inv.type}, ${inv.institution})`}
            />
          </ListItem>
        ))}
      </List>
      <InvestmentForm
        open={dialogOpen}
        investment={editInvestment}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Investment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this investment? This action cannot be undone.
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

export default Investments;