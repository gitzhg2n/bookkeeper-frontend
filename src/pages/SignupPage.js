import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import FormInput from '../components/FormInput';

export default function SignupPage() {
  const { api } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.request('/v1/auth/register', { method: 'POST', body: JSON.stringify(form) });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Signup failed");
    }
    setLoading(false);
  }

  if (success) return <div style={{ maxWidth: 400, margin: '2rem auto', fontSize: '1.2rem' }}>Signup successful! Please log in.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FormInput label="Email" name="email" value={form.email} onChange={handleChange} placeholder="Email" disabled={loading} />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" disabled={loading} />
        <button type="submit" style={{ fontSize: '1.1rem', padding: '0.75rem' }} disabled={loading}>Sign Up</button>
      </form>
      <ErrorMessage error={error} />
    </div>
  );
}
