import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';

export default function NotificationPreferences() {
  const { api } = useAuth();
  const [prefs, setPrefs] = useState({ in_app: true, email: false, push: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPrefs() {
    setLoading(true);
    setError("");
    try {
      const res = await api.request('/v1/user_settings');
      setPrefs(res.data.notification_preferences || { in_app: true, email: false, push: false });
    } catch (err) {
      setError(err.message || "Failed to load preferences");
    }
    setLoading(false);
  }

  async function handleChange(e) {
    const { name, checked } = e.target;
    const newPrefs = { ...prefs, [name]: checked };
    setPrefs(newPrefs);
    setLoading(true);
    setError("");
    try {
      await api.request('/v1/user_settings', { method: 'PUT', body: JSON.stringify({ notification_preferences: newPrefs }) });
    } catch (err) {
      setError(err.message || "Failed to update preferences");
    }
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Notification Preferences</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ fontSize: '1.1rem' }}>
          <input type="checkbox" name="in_app" checked={prefs.in_app} onChange={handleChange} disabled={loading} /> In-App
        </label>
        <label style={{ fontSize: '1.1rem' }}>
          <input type="checkbox" name="email" checked={prefs.email} onChange={handleChange} disabled={loading} /> Email
        </label>
        <label style={{ fontSize: '1.1rem' }}>
          <input type="checkbox" name="push" checked={prefs.push} onChange={handleChange} disabled={loading} /> Push
        </label>
      </div>
    </div>
  );
}
