import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { IconButton, TextField, Grid, InputAdornment, Button as MuiButton, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useNavigate } from 'react-router-dom';
import { useAuthenticationContext } from '../../context/AuthenticationContext';

const SignUpComponent = () => {
  const navigate = useNavigate();

  const { register } = useAuthenticationContext();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    register(fullName, email, password);
    navigate('/');
  };

  return (
    <>
      <form onSubmit={submitHandler} className='padding1 margin1'>
        <Grid container spacing={3} direction='column' textAlign={'center'}>
          <h1>Admin sign up</h1>
          <Grid item>
            <TextField
              id='fullName'
              name='fullName'
              label='Full Name'
              type='name'
              value={fullName}
              required
              fullWidth
              onChange={(e) => setFullName(e.target.value)}
            />
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
              error={password.length && password.length < 8}
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
              <Typography>Sign Up</Typography>
            </LoadingButton>
          </Grid>
          <Grid item display={'flex'} justifyContent='center' sx={{ textAlign: 'center' }}>
            <Typography>
              Don't have an account?{' '}
              <Button onClick={() => navigate('/dev-login')} color='primary'>
                Sign In
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default SignUpComponent;
