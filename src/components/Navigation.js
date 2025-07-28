import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeProvider';

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
  { path: '/income-sources', label: 'Income Sources' },
];

function Navigation() {
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position='static' elevation={0} component='nav' role='navigation'>
      <Toolbar>
        <Typography
          variant='h6'
          component='div'
          sx={{ flexGrow: 1 }}
          role='heading'
          aria-level='1'
        >
          FinTrack
        </Typography>
        <Box
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          component='nav'
          role='navigation'
          aria-label='Main navigation'
        >
          {navItems.map(item => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color='inherit'
              aria-current={location.pathname === item.path ? 'page' : undefined}
              sx={{
                minWidth: 'auto',
                px: 2,
                mx: 0.5,
                backgroundColor:
                  location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                '&:focus-visible': {
                  outline: '2px solid currentColor',
                  outlineOffset: '2px',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              onClick={toggleTheme}
              color='inherit'
              sx={{ ml: 1 }}
              aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            >
              {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
