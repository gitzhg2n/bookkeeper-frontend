import React, { useState } from 'react';
import api from '../api';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

function BreakupWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ reason: '', account: '', transferAmount: 0 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleNext() {
    setStep(prev => prev + 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    api.post('/household/breakup', form)
      .then(() => setMessage('Breakup process initiated!'))
      .catch(() => setError('Failed to initiate breakup.'));
  }

  if (message) {
    return <Box maxWidth={350} mx="auto" my={5}><Alert severity="success">{message}</Alert></Box>;
  }

  return (
    <Box maxWidth={400} mx="auto" my={5} p={3} borderRadius={2} boxShadow={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Breakup Wizard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        {step === 0 && (
          <>
            <TextField
              label="Reason for breakup"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <Button type="button" variant="outlined" onClick={handleNext}>Next</Button>
          </>
        )}
        {step === 1 && (
          <>
            <TextField
              label="Account to transfer funds from"
              name="account"
              value={form.account}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <Button type="button" variant="outlined" onClick={handleNext}>Next</Button>
          </>
        )}
        {step === 2 && (
          <>
            <TextField
              label="Transfer Amount"
              name="transferAmount"
              type="number"
              value={form.transferAmount}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="error" sx={{ mt: 2 }}>Finish</Button>
          </>
        )}
      </form>
    </Box>
  );
}

export default BreakupWizard;