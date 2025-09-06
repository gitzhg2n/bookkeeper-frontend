import React from 'react';
import { required, minLength, minValue, isCurrency } from '../../utils/validation';
import { useForm, Controller } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  FormControl, 
  FormLabel, 
  FormHelperText,
  Box,
  Typography
} from '@mui/material';

// Enhanced form component with validation
export function ValidatedForm({ 
  onSubmit, 
  fields, 
  submitText = 'Submit',
  loading = false,
  title,
  defaultValues = {}
}) {
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    defaultValues,
    mode: 'onChange', // Validate on change
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset(); // Clear form on success
    } catch (error) {
      // Error handling done by NotificationContext
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 400 }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      
      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          rules={field.rules || {}}
          render={({ field: controllerField }) => (
            <TextField
              {...controllerField}
              label={field.label}
              type={field.type || 'text'}
              placeholder={field.placeholder}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message || field.helperText}
              disabled={loading || isSubmitting}
              fullWidth
              margin="normal"
              variant="outlined"
              {...field.props}
            />
          )}
        />
      ))}
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        {loading || isSubmitting ? 'Loading...' : submitText}
      </Button>
    </Box>
  );
}

// Example usage for account creation
export function CreateAccountForm({ onSubmit, loading }) {
  // Use shared validation helpers

  const fields = [
    {
      name: 'name',
      label: 'Account Name',
      placeholder: 'e.g., Chase Checking',
      rules: { 
        ...required('Account name is required'),
        ...minLength(2, 'Name must be at least 2 characters')
      }
    },
    {
      name: 'type',
      label: 'Account Type',
      type: 'select',
      options: [
        { value: 'checking', label: 'Checking' },
        { value: 'savings', label: 'Savings' },
        { value: 'credit', label: 'Credit Card' },
        { value: 'investment', label: 'Investment' },
      ],
      rules: { ...required('Account type is required') }
    },
    {
      name: 'balance',
      label: 'Initial Balance',
      type: 'number',
      rules: { 
        ...required('Initial balance is required'),
        ...minValue(0, 'Balance must be non-negative')
      }
    },
    {
      name: 'currency',
      label: 'Currency',
      defaultValue: 'USD',
      rules: { ...required('Currency is required'), ...isCurrency('Currency must be a 3-letter code') }
    }
  ];

  return (
    <ValidatedForm
      title="Create Account"
      fields={fields}
      onSubmit={onSubmit}
      loading={loading}
      submitText="Create Account"
      defaultValues={{ currency: 'USD', type: 'checking' }}
    />
  );
}
