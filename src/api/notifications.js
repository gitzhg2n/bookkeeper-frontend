const base = process.env.REACT_APP_API_BASE || '';

export async function getNotifications() {
  const res = await fetch(`${base}/api/notifications`, {credentials: 'include'});
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function markAsRead(id) {
  const res = await fetch(`${base}/api/notifications/${id}/read`, {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
