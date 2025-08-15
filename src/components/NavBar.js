

import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/accounts">Accounts</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/goals">Goals</Link>
      <Link to="/alerts">Alerts</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/notification-preferences">Preferences</Link>
      <Link to="/onboarding">Onboarding</Link>
      {!isAuthenticated && <Link to="/login">Log In</Link>}
      {!isAuthenticated && <Link to="/signup">Sign Up</Link>}
      {isAuthenticated && (
        <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={logout}>
          Log Out
        </button>
      )}
    </nav>
  );
}
