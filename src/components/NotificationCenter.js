import React, {useEffect, useState} from 'react';
import {getNotifications, markAsRead} from '../api/notifications';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getNotifications()
      .then((data) => {
        if (!mounted) return;
        setNotifications(data || []);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load notifications');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? {...n, read: true} : n)));
    } catch (e) {
      // noop, optimistic update would be reverted in a fuller implementation
      console.error('markAsRead failed', e);
    }
  };

  if (loading) return <div data-testid="notif-loading">Loading notifications…</div>;
  if (error) return <div data-testid="notif-error">{error}</div>;

  if (!notifications.length) return <div data-testid="notif-empty">No notifications</div>;

  return (
    <div data-testid="notif-list">
      {notifications.map((n) => (
        <div key={n.id} style={{padding: '8px', borderBottom: '1px solid #eee'}}>
          <div style={{fontWeight: n.read ? 'normal' : 'bold'}}>{n.title}</div>
          <div style={{fontSize: '0.9em', color: '#666'}}>{n.body}</div>
          {!n.read && (
            <button data-testid={`mark-${n.id}`} onClick={() => handleMarkRead(n.id)}>Mark as read</button>
          )}
        </div>
      ))}
    </div>
  );
}
