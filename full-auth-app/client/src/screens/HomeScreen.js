import { Button, Typography } from '@mui/material';
import React from 'react';
import { useAuthenticationContext } from './../context/AuthenticationContext';

const HomeScreen = () => {
  const { logout } = useAuthenticationContext();

  return (
    <>
      <Typography>You are logged in!</Typography>
      <Button onClick={logout}>Logout</Button>
    </>
  );
};

export default HomeScreen;
