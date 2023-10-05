import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { colors } from '@mui/material'

const MuiCustomTheme = ({ children }) => {
  const theme = createTheme({
    palette: {
      // primary: {
      // main: colors.yellow['A400'],
      // main: '#56G7G9',
      // },
      // secondary: {
      // main: '#000000',
      // },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default MuiCustomTheme
