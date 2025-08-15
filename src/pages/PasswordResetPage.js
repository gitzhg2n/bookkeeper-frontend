import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import FormInput from '../components/FormInput';

export default function PasswordResetPage() {
  const { api } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.request('/v1/auth/password_reset', { method: 'POST', body: JSON.stringify({ email }) });
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    }
    setLoading(false);
  }

  if (sent) return <div style={{ maxWidth: 400, margin: '2rem auto', fontSize: '1.2rem' }}>Password reset email sent! Check your inbox.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reset Password</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormInput label="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" disabled={loading} />
        <button type="submit" style={{ fontSize: '1.1rem', padding: '0.75rem' }} disabled={loading}>Send Reset Email</button>
      </form>
      <ErrorMessage error={error} />
    </div>
  );
}
