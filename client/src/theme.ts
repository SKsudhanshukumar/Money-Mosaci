export const tokens = {
  grey: {
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
  primary: {
    // Modern teal/cyan gradient
    100: "#e6fffa",
    200: "#b3f5f0",
    300: "#81e6d9",
    400: "#4fd1c7",
    500: "#38b2ac",
    600: "#319795",
    700: "#2c7a7b",
    800: "#285e61",
    900: "#234e52",
  },
  secondary: {
    // Warm orange/amber
    100: "#fffbeb",
    200: "#fef3c7",
    300: "#fde68a",
    400: "#fcd34d",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  tertiary: {
    // Modern purple
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
  },
  success: {
    100: "#f0fff4",
    200: "#c6f6d5",
    300: "#9ae6b4",
    400: "#68d391",
    500: "#48bb78",
    600: "#38a169",
    700: "#2f855a",
    800: "#276749",
    900: "#22543d",
  },
  error: {
    100: "#fed7d7",
    200: "#feb2b2",
    300: "#fc8181",
    400: "#f56565",
    500: "#e53e3e",
    600: "#c53030",
    700: "#9b2c2c",
    800: "#822727",
    900: "#63171b",
  },
  warning: {
    100: "#fffbeb",
    200: "#fef3c7",
    300: "#fde68a",
    400: "#fcd34d",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  background: {
    light: "#1a202c",
    main: "#0f1419",
    paper: "#2d3748",
  },
};

// Light mode color tokens
export const lightTokens = {
  grey: {
    100: "#212529",
    200: "#343a40",
    300: "#495057",
    400: "#6c757d",
    500: "#adb5bd",
    600: "#ced4da",
    700: "#dee2e6",
    800: "#e9ecef",
    900: "#f8f9fa",
  },
  primary: {
    // Inverted for light mode
    100: "#234e52",
    200: "#285e61",
    300: "#2c7a7b",
    400: "#319795",
    500: "#38b2ac",
    600: "#4fd1c7",
    700: "#81e6d9",
    800: "#b3f5f0",
    900: "#e6fffa",
  },
  secondary: {
    // Inverted for light mode
    100: "#78350f",
    200: "#92400e",
    300: "#b45309",
    400: "#d97706",
    500: "#f59e0b",
    600: "#fcd34d",
    700: "#fde68a",
    800: "#fef3c7",
    900: "#fffbeb",
  },
  tertiary: {
    // Modern purple for light mode
    100: "#581c87",
    200: "#6b21a8",
    300: "#7c3aed",
    400: "#9333ea",
    500: "#a855f7",
    600: "#c084fc",
    700: "#d8b4fe",
    800: "#e9d5ff",
    900: "#f3e8ff",
  },
  success: {
    100: "#22543d",
    200: "#276749",
    300: "#2f855a",
    400: "#38a169",
    500: "#48bb78",
    600: "#68d391",
    700: "#9ae6b4",
    800: "#c6f6d5",
    900: "#f0fff4",
  },
  error: {
    100: "#63171b",
    200: "#822727",
    300: "#9b2c2c",
    400: "#c53030",
    500: "#e53e3e",
    600: "#f56565",
    700: "#fc8181",
    800: "#feb2b2",
    900: "#fed7d7",
  },
  warning: {
    100: "#78350f",
    200: "#92400e",
    300: "#b45309",
    400: "#d97706",
    500: "#f59e0b",
    600: "#fcd34d",
    700: "#fde68a",
    800: "#fef3c7",
    900: "#fffbeb",
  },
  background: {
    light: "#ffffff",
    main: "#f8f9fa",
    paper: "#ffffff",
  },
};

// mui theme settings
export const themeSettings = (mode: 'light' | 'dark') => {
  const currentTokens = mode === 'light' ? lightTokens : tokens;
  
  return {
    palette: {
      mode,
      primary: {
        ...currentTokens.primary,
        main: currentTokens.primary[500],
        light: currentTokens.primary[400],
        dark: currentTokens.primary[600],
      },
      secondary: {
        ...currentTokens.secondary,
        main: currentTokens.secondary[500],
        light: currentTokens.secondary[400],
        dark: currentTokens.secondary[600],
      },
      tertiary: {
        ...currentTokens.tertiary,
        main: currentTokens.tertiary[500],
      },
      success: {
        ...currentTokens.success,
        main: currentTokens.success[500],
        light: currentTokens.success[400],
        dark: currentTokens.success[600],
      },
      error: {
        ...currentTokens.error,
        main: currentTokens.error[500],
        light: currentTokens.error[400],
        dark: currentTokens.error[600],
      },
      warning: {
        ...currentTokens.warning,
        main: currentTokens.warning[500],
        light: currentTokens.warning[400],
        dark: currentTokens.warning[600],
      },
      grey: {
        ...currentTokens.grey,
        main: currentTokens.grey[500],
      },
      background: {
        default: currentTokens.background.main,
        paper: currentTokens.background.paper,
      },
      text: {
        primary: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[100],
        secondary: mode === 'light' ? currentTokens.grey[300] : currentTokens.grey[400],
      },
    },
    typography: {
      fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "2.5rem",
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "-0.01562em",
        color: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[100],
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "2rem",
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "-0.00833em",
        color: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[100],
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0em",
        color: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[100],
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0.00735em",
        color: mode === 'light' ? currentTokens.grey[200] : currentTokens.grey[200],
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: "0em",
        color: mode === 'light' ? currentTokens.grey[300] : currentTokens.grey[300],
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.6,
        letterSpacing: "0.0075em",
        color: mode === 'light' ? currentTokens.grey[400] : currentTokens.grey[400],
      },
      body1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.00938em",
      },
      body2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: "0.01071em",
      },
      caption: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: "0.03333em",
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      "none",
      mode === 'light' 
        ? "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
        : "0px 2px 1px -1px rgba(0,0,0,0.4),0px 1px 1px 0px rgba(0,0,0,0.28),0px 1px 3px 0px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)"
        : "0px 3px 1px -2px rgba(0,0,0,0.4),0px 2px 2px 0px rgba(0,0,0,0.28),0px 1px 5px 0px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)"
        : "0px 3px 3px -2px rgba(0,0,0,0.4),0px 3px 4px 0px rgba(0,0,0,0.28),0px 1px 8px 0px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
        : "0px 2px 4px -1px rgba(0,0,0,0.4),0px 4px 5px 0px rgba(0,0,0,0.28),0px 1px 10px 0px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)"
        : "0px 3px 5px -1px rgba(0,0,0,0.4),0px 5px 8px 0px rgba(0,0,0,0.28),0px 1px 14px 0px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)"
        : "0px 3px 5px -1px rgba(0,0,0,0.4),0px 6px 10px 0px rgba(0,0,0,0.28),0px 1px 18px 0px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)"
        : "0px 4px 5px -2px rgba(0,0,0,0.4),0px 7px 10px 1px rgba(0,0,0,0.28),0px 2px 16px 1px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)"
        : "0px 5px 5px -3px rgba(0,0,0,0.4),0px 8px 10px 1px rgba(0,0,0,0.28),0px 3px 14px 2px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)"
        : "0px 5px 6px -3px rgba(0,0,0,0.4),0px 9px 12px 1px rgba(0,0,0,0.28),0px 3px 16px 2px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)"
        : "0px 6px 6px -3px rgba(0,0,0,0.4),0px 10px 14px 1px rgba(0,0,0,0.28),0px 4px 18px 3px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)"
        : "0px 6px 7px -4px rgba(0,0,0,0.4),0px 11px 15px 1px rgba(0,0,0,0.28),0px 4px 20px 3px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)"
        : "0px 7px 8px -4px rgba(0,0,0,0.4),0px 12px 17px 2px rgba(0,0,0,0.28),0px 5px 22px 4px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)"
        : "0px 7px 8px -4px rgba(0,0,0,0.4),0px 13px 19px 2px rgba(0,0,0,0.28),0px 5px 24px 4px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)"
        : "0px 7px 9px -4px rgba(0,0,0,0.4),0px 14px 21px 2px rgba(0,0,0,0.28),0px 5px 26px 4px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)"
        : "0px 8px 9px -5px rgba(0,0,0,0.4),0px 15px 22px 2px rgba(0,0,0,0.28),0px 6px 28px 5px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)"
        : "0px 8px 10px -5px rgba(0,0,0,0.4),0px 16px 24px 2px rgba(0,0,0,0.28),0px 6px 30px 5px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)"
        : "0px 8px 11px -5px rgba(0,0,0,0.4),0px 17px 26px 2px rgba(0,0,0,0.28),0px 6px 32px 5px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)"
        : "0px 9px 11px -5px rgba(0,0,0,0.4),0px 18px 28px 2px rgba(0,0,0,0.28),0px 7px 34px 6px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)"
        : "0px 9px 12px -6px rgba(0,0,0,0.4),0px 19px 29px 2px rgba(0,0,0,0.28),0px 7px 36px 6px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)"
        : "0px 10px 13px -6px rgba(0,0,0,0.4),0px 20px 31px 3px rgba(0,0,0,0.28),0px 8px 38px 7px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)"
        : "0px 10px 13px -6px rgba(0,0,0,0.4),0px 21px 33px 3px rgba(0,0,0,0.28),0px 8px 40px 7px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)"
        : "0px 10px 14px -6px rgba(0,0,0,0.4),0px 22px 35px 3px rgba(0,0,0,0.28),0px 8px 42px 7px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)"
        : "0px 11px 14px -7px rgba(0,0,0,0.4),0px 23px 36px 3px rgba(0,0,0,0.28),0px 9px 44px 8px rgba(0,0,0,0.24)",
      mode === 'light'
        ? "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)"
        : "0px 11px 15px -7px rgba(0,0,0,0.4),0px 24px 38px 3px rgba(0,0,0,0.28),0px 9px 46px 8px rgba(0,0,0,0.24)",
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: mode === 'light' 
                ? '0 4px 8px rgba(0,0,0,0.12)' 
                : '0 4px 8px rgba(0,0,0,0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' 
                ? '0 8px 25px rgba(0,0,0,0.15)' 
                : '0 8px 25px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };
};
