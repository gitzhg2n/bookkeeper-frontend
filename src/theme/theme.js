import { createTheme } from '@mui/material/styles';

// Modern color palette inspired by contemporary fintech apps
const lightPalette = {
  primary: {
    main: '#00C896', // Modern green for financial growth
    light: '#4DD9B4',
    dark: '#00A67C',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6366F1', // Modern indigo for depth
    light: '#818CF8',
    dark: '#4338CA',
    contrastText: '#ffffff',
  },
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#DC2626',
  },
  warning: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#D97706',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  background: {
    default: '#F9FAFB',
    paper: '#ffffff',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
  divider: '#E5E7EB',
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const darkPalette = {
  primary: {
    main: '#10B981', // Slightly different green for dark mode
    light: '#34D399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#818CF8',
    light: '#A5B4FC',
    dark: '#6366F1',
    contrastText: '#ffffff',
  },
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#DC2626',
  },
  warning: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#D97706',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  info: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#3B82F6',
  },
  background: {
    default: '#0F172A',
    paper: '#1E293B',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
  },
  divider: '#334155',
  grey: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
};

// Enhanced typography with better accessibility
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.375,
    letterSpacing: '-0.02em',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '-0.01em',
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
};

// Create theme function
export const createAppTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography,
    spacing: 8,
    shape: {
      borderRadius: 12, // More modern rounded corners
    },
    shadows:
      mode === 'light'
        ? [
          'none',
          '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
          '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
          '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
          ...Array(19).fill('0px 25px 50px -12px rgba(0, 0, 0, 0.25)'),
        ]
        : [
          'none',
          '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.18)',
          '0px 4px 6px -1px rgba(0, 0, 0, 0.3), 0px 2px 4px -1px rgba(0, 0, 0, 0.18)',
          '0px 10px 15px -3px rgba(0, 0, 0, 0.3), 0px 4px 6px -2px rgba(0, 0, 0, 0.15)',
          '0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.12)',
          '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
          ...Array(19).fill('0px 25px 50px -12px rgba(0, 0, 0, 0.5)'),
        ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '*': {
              scrollbarWidth: 'thin',
              scrollbarColor: mode === 'light' ? '#CBD5E1 #F1F5F9' : '#475569 #1E293B',
            },
            '*::-webkit-scrollbar': {
              width: '8px',
            },
            '*::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#F1F5F9' : '#1E293B',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? '#CBD5E1' : '#475569',
              borderRadius: '4px',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              backgroundColor: mode === 'light' ? '#94A3B8' : '#64748B',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 20px',
            transition: 'all 0.2s ease-in-out',
            '&:focus-visible': {
              outline: `2px solid ${mode === 'light' ? lightPalette.primary.main : darkPalette.primary.main}`,
              outlineOffset: '2px',
            },
          },
          contained: {
            boxShadow:
              mode === 'light'
                ? '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
                : '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.18)',
            '&:hover': {
              boxShadow:
                mode === 'light'
                  ? '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : '0px 4px 6px -1px rgba(0, 0, 0, 0.3), 0px 2px 4px -1px rgba(0, 0, 0, 0.18)',
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: mode === 'light' ? '1px solid #E5E7EB' : '1px solid #334155',
            boxShadow:
              mode === 'light'
                ? '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
                : '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.18)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow:
                mode === 'light'
                  ? '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  : '0px 10px 15px -3px rgba(0, 0, 0, 0.3), 0px 4px 6px -2px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: mode === 'light' ? '1px solid #E5E7EB' : '1px solid #334155',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === 'light'
                ? '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)'
                : '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.18)',
            backdropFilter: 'blur(10px)',
            backgroundColor:
              mode === 'light' ? 'rgba(249, 250, 251, 0.8)' : 'rgba(15, 23, 42, 0.8)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:focus-within': {
                outline: `2px solid ${mode === 'light' ? lightPalette.primary.main : darkPalette.primary.main}`,
                outlineOffset: '2px',
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: `2px solid ${mode === 'light' ? lightPalette.primary.main : darkPalette.primary.main}`,
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            '& .MuiCheckbox-root, & .MuiRadio-root': {
              '&:focus-visible': {
                outline: `2px solid ${mode === 'light' ? lightPalette.primary.main : darkPalette.primary.main}`,
                outlineOffset: '2px',
              },
            },
          },
        },
      },
    },
  });

// Export default light theme for backwards compatibility
const theme = createAppTheme('light');

export default theme;
