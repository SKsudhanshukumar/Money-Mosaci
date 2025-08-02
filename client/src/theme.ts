// Professional Banking Theme with Corporate Design System

export const tokens = {
  // Professional Banking Color Palette
  grey: {
    50: "#fafafa",
    100: "#f5f5f5", 
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  primary: {
    // Professional Blue - Banking Standard
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3", // Main brand color
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
  secondary: {
    // Professional Teal - Trust & Stability
    50: "#e0f2f1",
    100: "#b2dfdb",
    200: "#80cbc4",
    300: "#4db6ac",
    400: "#26a69a",
    500: "#009688",
    600: "#00897b",
    700: "#00796b",
    800: "#00695c",
    900: "#004d40",
  },
  accent: {
    // Gold - Premium Banking
    50: "#fffde7",
    100: "#fff9c4",
    200: "#fff59d",
    300: "#fff176",
    400: "#ffee58",
    500: "#ffeb3b",
    600: "#fdd835",
    700: "#fbc02d",
    800: "#f9a825",
    900: "#f57f17",
  },
  success: {
    50: "#e8f5e8",
    100: "#c8e6c9",
    200: "#a5d6a7",
    300: "#81c784",
    400: "#66bb6a",
    500: "#4caf50",
    600: "#43a047",
    700: "#388e3c",
    800: "#2e7d32",
    900: "#1b5e20",
  },
  warning: {
    50: "#fff8e1",
    100: "#ffecb3",
    200: "#ffe082",
    300: "#ffd54f",
    400: "#ffca28",
    500: "#ffc107",
    600: "#ffb300",
    700: "#ffa000",
    800: "#ff8f00",
    900: "#ff6f00",
  },
  error: {
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
  },
  background: {
    default: "#f8fafc",
    paper: "#ffffff",
    elevated: "#f1f5f9",
    surface: "#ffffff",
    overlay: "rgba(255, 255, 255, 0.95)",
  },
  text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#bdbdbd",
    hint: "#9e9e9e",
  },
};

// Dark theme tokens for professional night mode
export const darkTokens = {
  grey: {
    50: "#212121",
    100: "#424242",
    200: "#616161",
    300: "#757575",
    400: "#9e9e9e",
    500: "#bdbdbd",
    600: "#e0e0e0",
    700: "#eeeeee",
    800: "#f5f5f5",
    900: "#fafafa",
  },
  primary: {
    50: "#0d47a1",
    100: "#1565c0",
    200: "#1976d2",
    300: "#1e88e5",
    400: "#2196f3",
    500: "#42a5f5",
    600: "#64b5f6",
    700: "#90caf9",
    800: "#bbdefb",
    900: "#e3f2fd",
  },
  secondary: {
    50: "#004d40",
    100: "#00695c",
    200: "#00796b",
    300: "#00897b",
    400: "#009688",
    500: "#26a69a",
    600: "#4db6ac",
    700: "#80cbc4",
    800: "#b2dfdb",
    900: "#e0f2f1",
  },
  accent: {
    50: "#f57f17",
    100: "#f9a825",
    200: "#fbc02d",
    300: "#fdd835",
    400: "#ffeb3b",
    500: "#ffee58",
    600: "#fff176",
    700: "#fff59d",
    800: "#fff9c4",
    900: "#fffde7",
  },
  success: {
    50: "#1b5e20",
    100: "#2e7d32",
    200: "#388e3c",
    300: "#43a047",
    400: "#4caf50",
    500: "#66bb6a",
    600: "#81c784",
    700: "#a5d6a7",
    800: "#c8e6c9",
    900: "#e8f5e8",
  },
  warning: {
    50: "#ff6f00",
    100: "#ff8f00",
    200: "#ffa000",
    300: "#ffb300",
    400: "#ffc107",
    500: "#ffca28",
    600: "#ffd54f",
    700: "#ffe082",
    800: "#ffecb3",
    900: "#fff8e1",
  },
  error: {
    50: "#b71c1c",
    100: "#c62828",
    200: "#d32f2f",
    300: "#e53935",
    400: "#f44336",
    500: "#ef5350",
    600: "#e57373",
    700: "#ef9a9a",
    800: "#ffcdd2",
    900: "#ffebee",
  },
  background: {
    default: "#0f172a",
    paper: "#1e293b",
    elevated: "#334155",
    surface: "#1e293b",
    overlay: "rgba(30, 41, 59, 0.95)",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b3b3b3",
    disabled: "#666666",
    hint: "#888888",
  },
};

// Professional Banking Theme Settings
export const themeSettings = (mode: 'light' | 'dark') => {
  const currentTokens = mode === 'light' ? tokens : darkTokens;
  
  return {
    palette: {
      mode,
      primary: {
        ...currentTokens.primary,
        main: currentTokens.primary[500],
        light: currentTokens.primary[300],
        dark: currentTokens.primary[700],
        contrastText: mode === 'light' ? '#ffffff' : '#000000',
      },
      secondary: {
        ...currentTokens.secondary,
        main: currentTokens.secondary[500],
        light: currentTokens.secondary[300],
        dark: currentTokens.secondary[700],
        contrastText: '#ffffff',
      },
      accent: {
        ...currentTokens.accent,
        main: currentTokens.accent[500],
        light: currentTokens.accent[300],
        dark: currentTokens.accent[700],
      },
      success: {
        ...currentTokens.success,
        main: currentTokens.success[500],
        light: currentTokens.success[300],
        dark: currentTokens.success[700],
      },
      warning: {
        ...currentTokens.warning,
        main: currentTokens.warning[500],
        light: currentTokens.warning[300],
        dark: currentTokens.warning[700],
      },
      error: {
        ...currentTokens.error,
        main: currentTokens.error[500],
        light: currentTokens.error[300],
        dark: currentTokens.error[700],
      },
      grey: {
        ...currentTokens.grey,
      },
      background: {
        default: currentTokens.background.default,
        paper: currentTokens.background.paper,
        elevated: currentTokens.background.elevated,
        surface: currentTokens.background.surface,
        overlay: currentTokens.background.overlay,
      },
      text: {
        primary: currentTokens.text.primary,
        secondary: currentTokens.text.secondary,
        disabled: currentTokens.text.disabled,
        hint: currentTokens.text.hint,
      },
      divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: [
        '"Inter"',
        '"Roboto"',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      fontWeightExtraBold: 700,
      h1: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: currentTokens.text.primary,
      },
      h2: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        color: currentTokens.text.primary,
      },
      h3: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: currentTokens.text.primary,
      },
      h4: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: currentTokens.text.primary,
      },
      h5: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: currentTokens.text.primary,
      },
      h6: {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: currentTokens.text.primary,
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.6,
        color: currentTokens.text.primary,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.6,
        color: currentTokens.text.secondary,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: currentTokens.text.primary,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: currentTokens.text.secondary,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
        color: currentTokens.text.secondary,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.5,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: currentTokens.text.secondary,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: mode === 'light' ? [
      'none',
      '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.12)',
      '0px 3px 6px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14)',
      '0px 6px 12px rgba(0, 0, 0, 0.15), 0px 4px 8px rgba(0, 0, 0, 0.18)',
      '0px 8px 16px rgba(0, 0, 0, 0.15), 0px 6px 12px rgba(0, 0, 0, 0.18)',
      '0px 12px 24px rgba(0, 0, 0, 0.18), 0px 8px 16px rgba(0, 0, 0, 0.20)',
      ...Array(19).fill('none')
    ] : [
      'none',
      '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(0, 0, 0, 0.4)',
      '0px 3px 6px rgba(0, 0, 0, 0.4), 0px 2px 4px rgba(0, 0, 0, 0.5)',
      '0px 6px 12px rgba(0, 0, 0, 0.5), 0px 4px 8px rgba(0, 0, 0, 0.6)',
      '0px 8px 16px rgba(0, 0, 0, 0.5), 0px 6px 12px rgba(0, 0, 0, 0.6)',
      '0px 12px 24px rgba(0, 0, 0, 0.6), 0px 8px 16px rgba(0, 0, 0, 0.7)',
      ...Array(19).fill('none')
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: mode === 'light' ? '#bdbdbd #f5f5f5' : '#757575 #2d2d2d',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: mode === 'light' ? '#bdbdbd' : '#757575',
              minHeight: 24,
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
            fontSize: '0.875rem',
            padding: '10px 20px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0px 2px 8px rgba(33, 150, 243, 0.24)' 
                : '0px 2px 8px rgba(66, 165, 245, 0.32)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0px 4px 12px rgba(33, 150, 243, 0.32)' 
                : '0px 4px 12px rgba(66, 165, 245, 0.40)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' 
                ? '0px 8px 24px rgba(0, 0, 0, 0.12)' 
                : '0px 8px 24px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          },
          elevation1: {
            boxShadow: mode === 'light' 
              ? '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.12)'
              : '0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(0, 0, 0, 0.4)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: currentTokens.primary[400],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: currentTokens.primary[500],
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          },
          head: {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: currentTokens.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
  };
};

// Export theme utilities
export const getDesignTokens = (mode: 'light' | 'dark') => themeSettings(mode);