import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { IconButton, TextField, Grid, InputAdornment, Button as MuiButton, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

const SignUpScreen = ({}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    try {
      const { data } = await axios.post(
        // TODO: allow user to get activation email again
        `/api/users/register`,
        {
          name,
          username,
          email,
          password,
        }
      );
      console.log('Token:', data);
      toast.success(`We sent you an email for account activation!`);
    } catch (error) {
      toast.error(error.response.data.error_message);
      console.error(error.response.status, error.response.data.error_message);
      if (error.response.status === 403) console.log('Cannot register');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    register();
  };

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
                <Typography variant='h6'>Sign up for free!</Typography>
              </Grid>
              <Grid item>
                <TextField id='name' name='name' label='Name' type='name' value={name} required fullWidth onChange={(e) => setName(e.target.value)} />
              </Grid>
              <Grid item>
                <TextField
                  id='username'
                  name='username'
                  label='Username'
                  type='username'
                  value={username}
                  required
                  fullWidth
                  onChange={(e) => setUsername(e.target.value)}
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
                <LoadingButton endIcon={<LoginIcon />} variant='contained' type='submit' size='large' color='primary' disabled={password.length < 8}>
                  <Typography>Sign Up</Typography>
                </LoadingButton>
              </Grid>
              <Grid item>
                <Button onClick={() => navigate('/')}>Login </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
