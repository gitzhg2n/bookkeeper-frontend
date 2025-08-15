
import navItems from '../config/navItems'; // new config file for navigation items

export function Layout({ children }) {
  const { user, logout, tokens, api } = useAuth();
  const { households, selectedId, setSelectedId } = useHouseholds();
  const loc = useLocation();

  const handleLogout = async () => {
    await api.logout(tokens?.refreshToken);
    logout();
    // Optionally clear other sensitive state here
    window.localStorage.clear();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <aside style={{ width: 220, background: '#111827', color: '#fff', padding: '1rem 0' }}>
        <div style={{ padding: '0 1rem', fontWeight: 600, fontSize: 18 }}>Bookkeeper</div>
        <nav style={{ marginTop: 16 }}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'block',
                padding: '8px 16px',
                textDecoration: 'none',
                color: loc.pathname === item.to ? '#00C896' : '#fff',
                fontWeight: loc.pathname === item.to ? 600 : 400,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid #1f2937', marginTop: 24 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Household</div>
          <select
            value={selectedId || ''}
            onChange={e => setSelectedId(Number(e.target.value) || null)}
            style={{ width: '100%', marginTop: 4 }}
          >
            <option value="">— None —</option>
            {households.map(h => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        {/* Responsive sidebar toggle for mobile (optional, add CSS/JS as needed) */}
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fff',
          }}
        >
          <div style={{ fontWeight: 500 }}>{loc.pathname === '/' ? 'Dashboard' : loc.pathname.slice(1)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14 }}>{user?.email}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
              Logout
            </button>
          </div>
        </header>
        <main style={{ flex: 1, padding: 24, background: '#f9fafb' }}>{children}</main>
      </div>
    </div>
  );
}
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fff',
          }}
        >
          <div style={{ fontWeight: 500 }}>{loc.pathname === '/' ? 'Dashboard' : loc.pathname.slice(1)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14 }}>{user?.email}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px' }}>
              Logout
            </button>
          </div>
        </header>
        <main style={{ flex: 1, padding: 24, background: '#f9fafb' }}>{children}</main>
      </div>
    </div>
  );
}
