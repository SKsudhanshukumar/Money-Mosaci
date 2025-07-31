import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "1rem",
  boxShadow: theme.palette.mode === 'light' 
    ? "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)" 
    : "0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)",
  border: theme.palette.mode === 'light' 
    ? `1px solid ${theme.palette.grey[700]}` 
    : `1px solid ${theme.palette.grey[800]}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backdropFilter: 'blur(10px)',
  height: '100%',
  maxHeight: '100%',
  
  // Gradient border effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    padding: '1px',
    background: theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${theme.palette.primary[300]}, ${theme.palette.secondary[300]})`
      : `linear-gradient(135deg, ${theme.palette.primary[600]}, ${theme.palette.secondary[600]})`,
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'light' 
      ? "0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.08)" 
      : "0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.3)",
    
    '&::before': {
      opacity: 0.6,
    },
  },
  
  '&:focus-within': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  
  // Glass morphism effect for dark mode
  ...(theme.palette.mode === 'dark' && {
    background: `linear-gradient(135deg, 
      ${theme.palette.background.paper}CC, 
      ${theme.palette.background.elevated}99)`,
  }),
  
  // Light mode glass effect
  ...(theme.palette.mode === 'light' && {
    background: `linear-gradient(135deg, 
      ${theme.palette.background.paper}F5, 
      ${theme.palette.background.elevated}E6)`,
  }),
}));

export default DashboardBox;
