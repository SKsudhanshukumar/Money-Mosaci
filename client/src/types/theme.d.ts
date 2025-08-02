import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }

  interface TypeBackground {
    elevated: string;
    surface: string;
    overlay: string;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    elevated: string;
    surface: string;
    overlay: string;
  }
}