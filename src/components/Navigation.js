import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/accounts', label: 'Accounts' },
  { path: '/budgets', label: 'Budgets' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/investments', label: 'Investments' },
  { path: '/goals', label: 'Goals' },
  { path: '/settings', label: 'Settings' },
  { path: '/upgrade', label: 'Upgrade' },
  { path: '/breakup', label: 'Breakup Wizard' },
  { path: '/household', label: 'Household Manager' },
];

function Navigation() {
  const { pathname } = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        {navItems.map(item => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            color={pathname === item.path ? "secondary" : "inherit"}
            sx={{ fontWeight: pathname === item.path ? 'bold' : 'normal', mx: 1 }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;