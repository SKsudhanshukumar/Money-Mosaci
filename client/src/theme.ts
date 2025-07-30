export const tokens = {
  grey: {
    100: "#f0f0f3",
    200: "#e1e2e7",
    300: "#d1d3da",
    400: "#c2c5ce",
    500: "#b3b6c2",
    600: "#8f929b",
    700: "#6b6d74",
    800: "#48494e",
    900: "#242427",
  },
  primary: {
    // light green
    100: "#d0fcf4",
    200: "#a0f9e9",
    300: "#71f5de",
    400: "#41f2d3",
    500: "#12efc8",
    600: "#0ebfa0",
    700: "#0b8f78",
    800: "#076050",
    900: "#043028",
  },
  secondary: {
    // yellow
    100: "#fcf0dd",
    200: "#fae1bb",
    300: "#f7d299",
    400: "#f5c377",
    500: "#f2b455",
    600: "#c29044",
    700: "#916c33",
    800: "#614822",
    900: "#302411",
  },
  tertiary: {
    // purple
    500: "#8884d8",
  },
  background: {
    light: "#2d2d34",
    main: "#1f2026",
  },
};

// Light mode color tokens
export const lightTokens = {
  grey: {
    100: "#242427",
    200: "#48494e",
    300: "#6b6d74",
    400: "#8f929b",
    500: "#b3b6c2",
    600: "#c2c5ce",
    700: "#d1d3da",
    800: "#e1e2e7",
    900: "#f0f0f3",
  },
  primary: {
    // darker green for light mode
    100: "#043028",
    200: "#076050",
    300: "#0b8f78",
    400: "#0ebfa0",
    500: "#12efc8",
    600: "#41f2d3",
    700: "#71f5de",
    800: "#a0f9e9",
    900: "#d0fcf4",
  },
  secondary: {
    // darker yellow for light mode
    100: "#302411",
    200: "#614822",
    300: "#916c33",
    400: "#c29044",
    500: "#f2b455",
    600: "#f5c377",
    700: "#f7d299",
    800: "#fae1bb",
    900: "#fcf0dd",
  },
  tertiary: {
    // purple
    500: "#8884d8",
  },
  background: {
    light: "#f5f5f5",
    main: "#ffffff",
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
      },
      secondary: {
        ...currentTokens.secondary,
        main: currentTokens.secondary[500],
      },
      tertiary: {
        ...currentTokens.tertiary,
      },
      grey: {
        ...currentTokens.grey,
        main: currentTokens.grey[500],
      },
      background: {
        default: currentTokens.background.main,
        light: currentTokens.background.light,
        paper: currentTokens.background.light,
      },
      text: {
        primary: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[200],
        secondary: mode === 'light' ? currentTokens.grey[300] : currentTokens.grey[300],
      },
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
        color: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[200],
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
        color: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[200],
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 800,
        color: mode === 'light' ? currentTokens.grey[100] : currentTokens.grey[200],
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 600,
        color: mode === 'light' ? currentTokens.grey[200] : currentTokens.grey[300],
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        fontWeight: 400,
        color: mode === 'light' ? currentTokens.grey[400] : currentTokens.grey[500],
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 10,
        color: mode === 'light' ? currentTokens.grey[600] : currentTokens.grey[700],
      },
    },
  };
};
