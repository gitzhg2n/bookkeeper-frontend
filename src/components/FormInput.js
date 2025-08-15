import React from 'react';

export default function FormInput({ label, name, value, onChange, type = 'text', placeholder = '', disabled = false }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '1.1rem' }}>
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        style={{ fontSize: '1.1rem', padding: '0.75rem' }}
        disabled={disabled}
      />
    </label>
  );
}
