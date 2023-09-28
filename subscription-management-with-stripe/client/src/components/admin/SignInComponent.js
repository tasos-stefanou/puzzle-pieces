import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { IconButton, TextField, Grid, InputAdornment, Button as MuiButton, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import { useAuthenticationContext } from '../../context/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

const SignInComponent = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, accessToken } = useAuthenticationContext();

  useEffect(() => {
    if (accessToken) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  }, [accessToken]);

  const submitHandler = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <>
      <form onSubmit={submitHandler} className='padding1 margin1'>
        <Grid container spacing={3} direction='column' textAlign={'center'}>
          <h1>Sign In</h1>
          <Grid item>
            <TextField
              id='email'
              name='email'
              label='Email'
              type='email'
              value={email}
              required
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id='password'
              name='password'
              label='Password'
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton aria-label='toggle password visibility' onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid display={'flex'} justifyContent='center' item>
            <LoadingButton variant='contained' type='submit' size='large' color='primary'>
              <Typography>Sign In</Typography>
            </LoadingButton>
          </Grid>
          <Grid item display={'flex'} justifyContent='center' sx={{ textAlign: 'center' }}>
            <Typography>
              Don't have an account?{' '}
              <Button onClick={() => navigate('/sign-up')} color='primary'>
                Sign Up
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default SignInComponent;
