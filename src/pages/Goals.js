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
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GoalForm from '../components/GoalForm';
import api from '../utils/api';

function Goals() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: goals,
    loading,
    error,
  } = useFetch('/goals', {
    initialData: [],
    dependencies: [refreshTrigger],
  });
  const setGoals = useStore(state => state.setGoals);

  useEffect(() => {
    if (goals) {
      setGoals(goals);
    }
  }, [goals, setGoals]);

  function handleAddClick() {
    setEditGoal(null);
    setDialogOpen(true);
  }
  function handleEditClick(goal) {
    setEditGoal(goal);
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
      await api.delete(`/goals/${deletingId}`);
      handleCloseDelete();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete goal');
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
    <Box maxWidth={600} mx='auto' my={4} p={3} borderRadius={2} boxShadow={2} bgcolor='#fff'>
      <Typography variant='h5' mb={2}>
        Goals
      </Typography>
      <Button
        variant='contained'
        color='primary'
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        sx={{ mb: 2 }}
      >
        Add Goal
      </Button>
      <List>
        {goals.map(goal => (
          <ListItem
            key={goal.id}
            secondaryAction={
              <Stack direction='row' spacing={1}>
                <IconButton edge='end' aria-label='edit' onClick={() => handleEditClick(goal)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge='end'
                  aria-label='delete'
                  onClick={() => handleOpenDelete(goal.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={goal.name}
              secondary={
                <>
                  Target: ${goal.target.toLocaleString()} &mdash; Progress: $
                  {goal.progress.toLocaleString()} ({goal.category})
                  <LinearProgress
                    variant='determinate'
                    value={Math.min(100, (goal.progress / goal.target) * 100)}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <GoalForm
        open={dialogOpen}
        goal={editGoal}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleFormSuccess}
      />
      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Delete Goal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this goal? This action cannot be undone.
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

export default Goals;
