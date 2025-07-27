import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  MenuItem, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../utils/api';

const accountTypes = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'loan', label: 'Loan' },
  { value: 'investment', label: 'Investment' },
  { value: 'retirement', label: 'Retirement' },
  { value: 'other', label: 'Other' },
];

function AccountForm({ open, account = null, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    type: 'checking',
    balance: '',
    institution: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isEdit = Boolean(account?.id);

  // Initialize form with account data if editing
  useEffect(() => {
    if (account) {
      setForm({
        name: account.name || '',
        type: account.type || 'checking',
        balance: account.balance !== undefined ? String(account.balance) : '',
        institution: account.institution || '',
      });
    } else {
      // Reset form for new account
      setForm({
        name: '',
        type: 'checking',
        balance: '',
        institution: '',
      });
    }
    // Clear any previous errors
    setErrors({});
    setError('');
  }, [account, open]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.institution.trim()) newErrors.institution = 'Institution is required';
    
    // Balance must be a valid number
    if (!form.balance.trim()) {
      newErrors.balance = 'Balance is required';
    } else if (isNaN(parseFloat(form.balance))) {
      newErrors.balance = 'Balance must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        ...form,
        balance: parseFloat(form.balance),
      };
      
      let response;
      if (isEdit) {
        response = await api.put(`/accounts/${account.id}`, payload);
      } else {
        response = await api.post('/accounts', payload);
      }
      
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Account' : 'Add New Account'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            name="name"
            label="Account Name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
            disabled={loading}
            autoFocus
            required
          />
          
          <FormControl fullWidth margin="normal" error={Boolean(errors.type)}>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="type"
              value={form.type}
              onChange={handleChange}
              label="Account Type"
              disabled={loading}
              required
            >
              {accountTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
          
          <TextField
            name="balance"
            label="Current Balance"
            value={form.balance}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            InputProps={{
              startAdornment: '$',
              step: '0.01',
            }}
            error={Boolean(errors.balance)}
            helperText={errors.balance}
            disabled={loading}
            required
          />
          
          <TextField
            name="institution"
            label="Financial Institution"
            value={form.institution}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={Boolean(errors.institution)}
            helperText={errors.institution}
            disabled={loading}
            required
          />
          
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AccountForm;
