import React, { useEffect, useState } from 'react';
import { Card, CardContent, Chip, Typography, Button, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useAuthenticationContext } from '../../context/AuthenticationContext';
import CreatePortalSessionButton from './CreatePortalSessionButton';
import { LoaderIcon } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

const SubscriptionPlan = ({ name, price, description, activePlanOfUser, activeSubscriptions }) => {
  const { accessToken } = useAuthenticationContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    setIsLoading(true);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const body = {
      plan: name,
    };

    console.log(activeSubscriptions);
    console.log(activeSubscriptions.length);
    if (activeSubscriptions && activeSubscriptions.length !== 0) {
      try {
        const { data } = await axios.post('/api/stripe/create-portal-session', {}, config);
        console.log(data);

        window.location = data.url;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post('/api/stripe/create-subscription-session', body, config);

        window.location = response.data.url;
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  };
  return (
    <Card
      style={{
        maxWidth: '225px',
        height: '250px',
        border: name === activePlanOfUser && '2px solid var(--primary)',
        borderRadius: '15px',
      }}
    >
      <CardContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {name === activePlanOfUser && (
          <Stack direction='row' spacing={1}>
            <Chip label='Current Plan' size='small' color='primary' style={{ fontSize: '1rem', fontWeight: '400' }} />
          </Stack>
        )}
        <Typography variant='h6' gutterBottom>
          {name}
        </Typography>
        <Typography variant='body1'>{description}</Typography>
        <div>
          <Typography variant='h5' color='text.secondary'>
            {price}€
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            /per year
          </Typography>
        </div>
        {name === activePlanOfUser ? (
          <Button
            style={{ width: '100%', maxWidth: '250px' }}
            variant='outlined'
            color='primary'
            onClick={handleSelect}
            disabled
            sx={{
              '&.Mui-disabled': {
                background: '#fff',
                color: 'var(--primary)',
                borderColor: 'var(--primary)',
              },
            }}
          >
            <CheckCircleIcon color='primary' />
            Selected
          </Button>
        ) : (
          <LoadingButton style={{ width: '100%', maxWidth: '250px' }} variant='outlined' loading={isLoading} onClick={handleSelect}>
            Select
          </LoadingButton>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlan;
