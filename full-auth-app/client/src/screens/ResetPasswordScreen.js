import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { IconButton, TextField, Grid, InputAdornment, Button as MuiButton, Button, Box, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';
import ButtonLink from '../components/ButtonLink';

import axios from 'axios';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    resetPassword();
  };

  const resetPassword = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/api/reset-password-token/check/`, {
        tokenId: params.token,
        password,
      });
      toast.success(data.message);
      navigate(`/`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error_message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <form className='eas-form' onSubmit={submitHandler}>
        <Grid container spacing={3} direction='column'>
          <Grid item>
            <Typography variant='h5'>Reset your password</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2'>Set your new password</Typography>
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
          <Grid item>
            <Typography variant='body2'>Confirm your new password</Typography>
          </Grid>
          <Grid item>
            <TextField
              id='password'
              name='password'
              label='Confirm password'
              type={confirmPasswordShown ? 'text' : 'password'}
              required
              fullWidth
              helperText={!confirmPassword ? '' : 'Your password must be at least 8 characters.'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton aria-label='toggle password visibility' onClick={() => setConfirmPasswordShown((prev) => !prev)}>
                      {confirmPasswordShown ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <small style={{ color: password.length >= 8 ? 'green' : 'red' }}>-Your password must contain at least 8 characters.</small>
          </Grid>
          <Grid item>
            {password === confirmPassword && password !== '' ? (
              <small style={{ color: 'green' }}>-Passwords match.</small>
            ) : (
              <small style={{ color: 'red' }}>-Passwords don't match.</small>
            )}
          </Grid>
          <Grid item>
            <LoadingButton
              loading={isLoading}
              type='submit'
              variant='contained'
              disabled={!(password === confirmPassword && password !== '' && password.length >= 8)}
            >
              Reset Password
            </LoadingButton>
          </Grid>
          <Grid item>
            <ButtonLink to='/' label={'Go to login'} />
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ResetPasswordScreen;
