import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required type="email" />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} required type="password" />
        </div>
        {err && <div style={{ color: 'red', marginTop: 12 }}>{err}</div>}
        <button style={{ marginTop: 16 }} disabled={loading}>{loading ? '...' : (mode === 'login' ? 'Login' : 'Register')}</button>
      </form>
      <button style={{ marginTop: 12 }} onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
    </div>
  );
}