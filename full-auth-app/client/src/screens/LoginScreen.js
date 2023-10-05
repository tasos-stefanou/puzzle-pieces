import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { IconButton, TextField, Grid, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

import { useAuthenticationContext } from './../context/AuthenticationContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setIsAuthenticated, setAccessToken, saveInfoAtLocalStorage } = useAuthenticationContext();

  const login = async () => {
    console.log('h');
    try {
      const {
        data: { token, username },
      } = await axios.post(`/api/users/login`, {
        email,
        password,
      });

      setIsAuthenticated(true);
      setAccessToken(token);
      saveInfoAtLocalStorage(token);

      toast.success(`Welcome ${username}`);
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.error_message);
      if (error.response.status === 403) console.log('Cannot login');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  const navigate = useNavigate();

  return (
    <div id='login-screen'>
      <div id='login-form-column'>
        <div id='login-form-container' className='shadowed padding1'>
          <form onSubmit={submitHandler} className='eas-form'>
            <Grid container spacing={3} direction='column'>
              <Grid item>
                <Typography variant='h4'>Full Authentcation App</Typography>
              </Grid>
              <Grid item>
                <Typography variant='h6'>Login to your account!</Typography>
              </Grid>
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
                  helperText={!password ? '' : 'Your password must be at least 8 characters.'}
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
                <LoadingButton endIcon={<LoginIcon />} variant='contained' type='submit' size='large' color='primary'>
                  <Typography>Login</Typography>
                </LoadingButton>
              </Grid>
              <Grid display={'flex'} justifyContent='center' flexDirection={'column'} item>
                <Button onClick={() => navigate('/passwordless-login')}>Login with magic link</Button>
                <Button color='error' onClick={() => navigate('/forgot-password')}>
                  Forgot password?
                </Button>
                <Button onClick={() => navigate('/sign-up')}>Sign up</Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
