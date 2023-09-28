import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colors } from '@mui/material';

const MuiCustomTheme = ({ children }) => {
  const SCG_PRIMARY = '#6448EF';
  const SCG_GREY = '#48445A';
  const theme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          // tooltip: {
          //   fontSize: '0.8rem',
          //   color: 'white',
          //   backgroundColor: 'var(--primary)',
          // },
        },
      },
    },
    palette: {
      primary: {
        // main: colors.deepPurple['A200'],
        main: SCG_PRIMARY,
      },
      secondary: {
        // main: colors.lime['A400'],
        main: colors.orange['A700'],
      },
      bronze: {
        main: colors.brown['A700'],
      },
      silver: {
        main: colors.grey['A700'],
      },
      gold: {
        main: colors.yellow['A700'],
      },
      tetriary: {
        main: colors.blueGrey['50'],
      },
    },
    typography: {
      fontFamily: `'Poppins', sans-serif`,

      button: {
        textTransform: 'none',
      },
      totalRegistrants: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.5rem',
        fontWeight: 400,
        color: '#48445A',
      },
      RegistrantsListSectionTitle: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1rem',
        fontWeight: 500,
        color: '#7787AB',
      },
      adminSectionTitle: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.5rem',
        fontWeight: 400,
        color: SCG_PRIMARY,
      },
      adminSectionDescription: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.1rem',
        fontWeight: 400,
        color: SCG_GREY,
      },
      registrantTitle: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1rem',
        fontWeight: 500,
        color: '#7787AB',
      },
      body1: {
        textTransform: 'none',
      },
      modalTitle: {
        color: SCG_PRIMARY,
        fontSize: '2.2rem',
      },
      h4: {
        textTransform: 'none',
      },
      h6: {
        textTransform: 'none',
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiCustomTheme;
