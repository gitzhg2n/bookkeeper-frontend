import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

function Onboard() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    api
      .post('/auth/register', form)
      .then(() => setStep(1))
      .catch(e => setError(e.response?.data?.message || 'Registration failed.'));
  }

  function handleFinish() {
    navigate('/login');
  }

  if (step === 1) {
    return (
      <Box maxWidth={350} mx='auto' my={5} p={3} borderRadius={2} boxShadow={2} bgcolor='#fff'>
        <Typography variant='h5' mb={2}>
          Welcome!
        </Typography>
        <Typography mb={2}>Your account is created. Please log in to continue.</Typography>
        <Button variant='contained' color='primary' onClick={handleFinish}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth={350} mx='auto' my={5} p={3} borderRadius={2} boxShadow={2} bgcolor='#fff'>
      <Typography variant='h5' mb={2}>
        Onboard
      </Typography>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          name='name'
          label='Name'
          fullWidth
          value={form.name}
          onChange={handleChange}
          required
          margin='normal'
        />
        <TextField
          name='email'
          label='Email'
          type='email'
          fullWidth
          value={form.email}
          onChange={handleChange}
          required
          margin='normal'
        />
        <TextField
          name='password'
          label='Password'
          type='password'
          fullWidth
          value={form.password}
          onChange={handleChange}
          required
          margin='normal'
        />
        <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
}

export default Onboard;
