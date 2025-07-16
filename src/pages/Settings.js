import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

function Settings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    setError('');
    api.put('/users/me', form)
      .then(res => {
        setUser(res.data);
        setMessage('Profile updated!');
      })
      .catch(e => setError(e.response?.data?.message || 'Update failed.'));
  }

  return (
    <Box maxWidth={400} mx="auto" my={5} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Settings</Typography>
      {message && <Alert severity="success" sx={{ mb: 1 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      <form onSubmit={handleSave}>
        <TextField
          name="name"
          label="Name"
          fullWidth
          value={form.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={form.email}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          Save
        </Button>
      </form>
    </Box>
  );
}

export default Settings;