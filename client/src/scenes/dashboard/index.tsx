import { Box, useMediaQuery, useTheme, Container } from "@mui/material";
import { motion } from "framer-motion";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "a b f"
  "d e f"
  "d e f"
  "d h i"
  "g h i"
  "g h j"
  "g h j"
`;

const gridTemplateMediumScreens = `
  "a a b"
  "a a b"
  "c c c"
  "d d e"
  "f f f"
  "g g h"
  "i i i"
  "j j j"
`;

const gridTemplateSmallScreens = `
  "a"
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "d"
  "d"
  "d"
  "e"
  "e"
  "f"
  "f"
  "f"
  "g"
  "g"
  "g"
  "h"
  "h"
  "h"
  "h"
  "i"
  "i"
  "j"
  "j"
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
        gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
        gridTemplateRows: "repeat(10, 120px)",
        gap: "1.5rem",
      };
    }
    if (isMediumScreen) {
      return {
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(8, 150px)",
        gap: "1rem",
      };
    }
    return {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "repeat(10, 400px)",
      gap: "1rem",
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
          sx={{
            width: "100%",
            minHeight: "100vh",
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
