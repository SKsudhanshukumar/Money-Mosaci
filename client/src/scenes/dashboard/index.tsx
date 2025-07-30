import { Box, useMediaQuery, useTheme, Container, Fade } from "@mui/material";
import { useEffect, useState } from "react";
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
  "a a b"
  "c c c"
  "d e f"
  "d e f"
  "g h i"
  "g h i"
  "j j j"
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
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width: 1400px)");
  const isMediumScreen = useMediaQuery("(min-width: 900px)");
  const isSmallScreen = useMediaQuery("(min-width: 600px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGridConfig = () => {
    if (isLargeScreen) {
      return {
        gridTemplateColumns: "repeat(3, minmax(400px, 1fr))",
        gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
        gridTemplateAreas: gridTemplateLargeScreens,
        gap: "1.5rem",
      };
    } else if (isMediumScreen) {
      return {
        gridTemplateColumns: "repeat(3, minmax(300px, 1fr))",
        gridTemplateRows: "repeat(10, minmax(55px, 1fr))",
        gridTemplateAreas: gridTemplateMediumScreens,
        gap: "1.25rem",
      };
    } else if (isSmallScreen) {
      return {
        gridTemplateColumns: "1fr",
        gridTemplateRows: "repeat(28, minmax(50px, 1fr))",
        gridTemplateAreas: gridTemplateSmallScreens,
        gap: "1rem",
      };
    } else {
      return {
        gridTemplateColumns: "1fr",
        gridTemplateRows: "repeat(28, minmax(45px, 1fr))",
        gridTemplateAreas: gridTemplateSmallScreens,
        gap: "0.75rem",
      };
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
      }}
    >
      <Fade in={mounted} timeout={600}>
        <Box
          className="fade-in"
          width="100%"
          height="100%"
          display="grid"
          sx={{
            ...getGridConfig(),
            minHeight: "calc(100vh - 200px)",
            // Smooth transitions for responsive changes
            transition: 'all 0.3s ease-in-out',
            
            // Enhanced grid styling
            '& > *': {
              minHeight: isSmallScreen ? '200px' : '150px',
            },
            
            // Responsive adjustments
            [theme.breakpoints.down('sm')]: {
              gap: '0.75rem',
              '& > *': {
                minHeight: '180px',
              },
            },
            
            [theme.breakpoints.down('xs')]: {
              gap: '0.5rem',
              '& > *': {
                minHeight: '160px',
              },
            },
          }}
        >
          <Row1 />
          <Row2 />
          <Row3 />
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard;
