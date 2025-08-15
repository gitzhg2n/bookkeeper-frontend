import React, { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';

export default function NotificationCenter() {
  const { api } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    setError("");
    try {
      const res = await api.request('/v1/notifications');
      setNotifications(res.data);
    } catch (err) {
      setError(err.message || "Failed to load notifications. Please try again later.");
    }
    setLoading(false);
  }

  async function markRead(id) {
    setError("");
    try {
      await api.request(`/v1/notifications/${id}/read`, { method: 'POST' });
      fetchNotifications();
    } catch (err) {
      setError(err.message || "Failed to mark notification as read. Please try again.");
    }
  }

  async function markAllRead() {
    setError("");
    try {
      await api.request('/v1/notifications/read_all', { method: 'POST' });
      fetchNotifications();
    } catch (err) {
      setError(err.message || "Failed to mark all as read. Please try again.");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Notification Center</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={markAllRead} style={{ marginBottom: '1rem' }}>Mark All Read</button>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.read ? 'normal' : 'bold', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <div>{n.title || n.type}</div>
            <div>{n.message}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(n.created_at).toLocaleString()}</div>
            {!n.read && <button onClick={() => markRead(n.id)} style={{ marginTop: '0.5rem' }}>Mark Read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
