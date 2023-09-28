import React from 'react';

import { useScgTierContext } from '../../context/ScgTierContext';
import { Button, Grid, Typography } from '@mui/material';
import CreateCheckoutSessionButton from './CreateCheckoutSessionButton';
import CreatePortalSessionButton from './CreatePortalSessionButton';

const SubscriptionScreen = () => {
  const { activePlanOfUser } = useScgTierContext();

  const isAtLeastBronze = activePlanOfUser !== 'FREE';
  const isAtLeastSilver = activePlanOfUser !== 'BRONZE' && activePlanOfUser !== 'FREE';
  const isGold = activePlanOfUser === 'GOLD';

  return (
    <div style={{ marginBlock: '2em' }}>
      <Grid container gap={'3em'} flexDirection='column'>
        <Grid item alignSelf='center' gap='3em' flexDirection='column'>
          <Typography variant='totalRegistrants'>Active plan: {activePlanOfUser}</Typography>
        </Grid>
        {activePlanOfUser === 'FREE' ? (
          <Grid item sx={{ display: 'flex', gap: '2em', justifyContent: 'center' }}>
            <CreateCheckoutSessionButton label='Select Bronze' planName='BRONZE' color={'bronze'} />
            <CreateCheckoutSessionButton label='Select Silver' planName='SILVER' color={'silver'} />
            <CreateCheckoutSessionButton label='Select Gold' planName='GOLD' color={'gold'} />
          </Grid>
        ) : (
          <CreatePortalSessionButton />
        )}
        <Grid item style={{ display: 'flex', flexDirection: 'column', gap: '3em' }}>
          <Button disabled={!isAtLeastBronze} variant='contained' color={'bronze'}>
            You can click this button if you are at least bronze
          </Button>
          <Button disabled={!isAtLeastSilver} variant='contained' color={'silver'}>
            You can click this button if you are at least silver
          </Button>
          <Button disabled={!isGold} variant='contained' color={'gold'}>
            You can click this button if you are at least gold
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SubscriptionScreen;
