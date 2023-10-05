import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { TextField, Grid, Button } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';

const PasswordlessLoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailWasSent, setEmailWasSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const forgotPassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await axios.get(`/api/passwordless-login-token/generate/${email}`);
      toast.success('We sent you an email to login.');
      setEmailWasSent(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error_message);
    }
    setIsLoading(false);
  };

  return (
    <div id='login-form-container' className='shadowed padding1'>
      <form onSubmit={forgotPassword} className='eas-form'>
        <Grid container spacing={3} direction='column'>
          <Grid item>
            <Typography variant='h4'>Full Authentcation App</Typography>
          </Grid>
          {emailWasSent ? (
            <Grid item>
              <Typography>Email was sent successfully. Please check your inbox.</Typography>
            </Grid>
          ) : (
            <>
              <Grid item>
                <Typography variant='h6'>You need no password!</Typography>
                <Typography variant='h6'>Provide an email and we will send you a link to login.</Typography>
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

              <Grid display={'flex'} justifyContent='center' item>
                <LoadingButton variant='contained' type='submit' size='large' color='primary' loading={isLoading}>
                  <Typography>Send magic link</Typography>
                </LoadingButton>
              </Grid>
            </>
          )}
          <Grid display={'flex'} justifyContent='center' item>
            <Button onClick={() => navigate('/')}>
              <Typography>Back to Login</Typography>
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default PasswordlessLoginScreen;
