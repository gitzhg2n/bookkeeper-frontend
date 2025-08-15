import React from 'react';

export default function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div style={{ color: 'red', marginTop: '1rem', fontSize: '1rem' }}>
      {error}
    </div>
  );
}
