import { Box, useMediaQuery, useTheme, Container } from "@mui/material";
import { motion } from "framer-motion";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

// Equal area grid templates - each area gets the same space
const gridTemplateLargeScreens = `
  "a b c"
  "d e f"
  "g h i"
  "j k l"
`;

const gridTemplateMediumScreens = `
  "a b"
  "c d"
  "e f"
  "g h"
  "i j"
  "k l"
`;

const gridTemplateSmallScreens = `
  "a"
  "b"
  "c"
  "d"
  "e"
  "f"
  "g"
  "h"
  "i"
  "j"
  "k"
  "l"
`;

const Dashboard = () => {
  const { palette } = useTheme();
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const getGridTemplate = () => {
    if (isLargeScreen) return gridTemplateLargeScreens;
    if (isMediumScreen) return gridTemplateMediumScreens;
    return gridTemplateSmallScreens;
  };

  const getGridConfig = () => {
    if (isLargeScreen) {
      return {
        gridTemplateColumns: "repeat(3, 1fr)", // Equal width columns
        gridTemplateRows: "repeat(4, 1fr)", // Equal height rows
        gap: "1.5rem",
        minHeight: "calc(100vh - 120px)", // Ensure full viewport usage
      };
    }
    if (isMediumScreen) {
      return {
        gridTemplateColumns: "repeat(2, 1fr)", // Equal width columns
        gridTemplateRows: "repeat(6, 1fr)", // Equal height rows
        gap: "1rem",
        minHeight: "calc(100vh - 120px)",
      };
    }
    return {
      gridTemplateColumns: "1fr", // Single column
      gridTemplateRows: "repeat(12, 1fr)", // Equal height rows
      gap: "1rem",
      minHeight: "calc(100vh - 120px)",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          className="dashboard-grid equal-grid-container"
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateAreas: getGridTemplate(),
            ...getGridConfig(),
            pb: 4,
            
            // Add subtle background pattern
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: palette.mode === 'light'
                ? `radial-gradient(circle at 25% 25%, ${palette.primary.main}08 0%, transparent 50%),
                   radial-gradient(circle at 75% 75%, ${palette.secondary.main}08 0%, transparent 50%)`
                : `radial-gradient(circle at 25% 25%, ${palette.primary.main}15 0%, transparent 50%),
                   radial-gradient(circle at 75% 75%, ${palette.secondary.main}15 0%, transparent 50%)`,
              pointerEvents: 'none',
              zIndex: -1,
            },
          }}
        >
          <Row1 />
          <Row2 />
          <Row3 />
        </Box>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
