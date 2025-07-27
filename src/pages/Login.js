import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    api
      .post('/auth/login', form)
      .then(res => {
        localStorage.setItem('authToken', res.data.token);
        navigate('/');
      })
      .catch(e => setError(e.response?.data?.message || 'Login failed.'));
  }

  return (
    <Box maxWidth={400} mx='auto' my={5} p={3} borderRadius={2} boxShadow={2} bgcolor='#fff'>
      <Typography variant='h5' mb={2}>
        Login
      </Typography>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
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
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
