// Small helpers to create react-hook-form validation rule objects
export function required(message = 'This field is required') {
  return { required: message };
}

export function minLength(length, message) {
  return { minLength: { value: length, message: message || `Must be at least ${length} characters` } };
}

export function minValue(min, message) {
  return { min: { value: min, message: message || `Must be at least ${min}` } };
}

export function isCurrency(message = 'Invalid currency') {
  // Basic validator for currency code (e.g., USD)
  return {
    validate: (v) => (typeof v === 'string' && v.length === 3) || message,
  };
}
