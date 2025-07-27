import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

function HouseholdManager() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/household/members')
      .then(res => setMembers(res.data))
      .catch(() => setMembers([]));
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    setError('');
    api
      .post('/household/members', { name: newMember })
      .then(res => {
        setMembers([...members, res.data]);
        setMessage('Member added!');
        setNewMember('');
      })
      .catch(() => setError('Failed to add member.'));
  }

  return (
    <Box maxWidth={400} mx='auto' my={5} p={3} borderRadius={2} boxShadow={2} bgcolor='#fff'>
      <Typography variant='h5' mb={2}>
        Household Manager
      </Typography>
      <form onSubmit={handleAdd}>
        <TextField
          name='newMember'
          label='Add household member'
          value={newMember}
          onChange={e => setNewMember(e.target.value)}
          required
          fullWidth
          margin='normal'
        />
        <Button type='submit' variant='contained' sx={{ mt: 1 }}>
          Add
        </Button>
      </form>
      {message && (
        <Alert severity='success' sx={{ my: 1 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity='error' sx={{ my: 1 }}>
          {error}
        </Alert>
      )}
      <List sx={{ mt: 2 }}>
        {members.map(m => (
          <ListItem key={m._id || m.id}>
            <ListItemText primary={m.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default HouseholdManager;
