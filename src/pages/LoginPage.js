import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h2 style={{ marginBottom: 8 }}>Bookkeeper {mode === 'login' ? 'Login' : 'Register'}</h2>
      <p style={{ opacity: 0.7, marginTop: 0 }}>Privacy-first personal finance.</p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}>
          Email
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            type="email"
            style={{ padding: 8 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}>
          Password
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            type="password"
            style={{ padding: 8 }}
          />
        </label>
        {err && <div style={{ color: 'red', fontSize: 14 }}>{err}</div>}
        <button disabled={loading} style={{ padding: '10px 16px' }}>
          {loading ? '...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <button
        style={{ marginTop: 12 }}
        onClick={() => setMode(m => (m === 'login' ? 'register' : 'login'))}
      >
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
    </div>
  );
}
