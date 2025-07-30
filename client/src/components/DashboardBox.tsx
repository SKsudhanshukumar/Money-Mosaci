import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: "1rem",
  boxShadow: theme.palette.mode === 'light' 
    ? "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .2)" 
    : "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .8)",
  border: theme.palette.mode === 'light' 
    ? `1px solid ${theme.palette.grey[300]}` 
    : 'none',
}));

export default DashboardBox;
