import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "1rem",
  boxShadow: theme.palette.mode === 'light' 
    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
    : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  border: theme.palette.mode === 'light' 
    ? `1px solid ${theme.palette.grey[200]}` 
    : `1px solid ${theme.palette.grey[800]}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  // Subtle gradient overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: theme.palette.mode === 'light'
      ? `linear-gradient(90deg, transparent, ${theme.palette.primary[200]}, transparent)`
      : `linear-gradient(90deg, transparent, ${theme.palette.primary[600]}, transparent)`,
    opacity: 0.6,
  },
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'light' 
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      : "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.2)",
    borderColor: theme.palette.mode === 'light' 
      ? theme.palette.primary[300] 
      : theme.palette.primary[700],
  },
  
  // Responsive padding
  padding: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2.5),
  },
  
  // Glass morphism effect for dark mode
  ...(theme.palette.mode === 'dark' && {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(45, 55, 72, 0.8)',
  }),
}));

export default DashboardBox;
