import { Typography } from '@mui/material';
import CreatePortalSessionButton from './CreatePortalSessionButton';

const SubscriptionCard = ({ subscription, BRONZE_PLAN_ID, SILVER_PLAN_ID, GOLD_PLAN_ID }) => {
  const unixToHuman = (unix) => {
    const date = new Date(unix * 1000);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return date.toLocaleString(undefined, options);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        maxWidth: '400px',
        padding: '2em',
        borderRadius: '8px',
      }}
      className='shadowed'
    >
      {subscription.plan.id === BRONZE_PLAN_ID && <Typography>Plan: Bronze</Typography>}
      {subscription.plan.id === SILVER_PLAN_ID && <Typography>Plan: Silver</Typography>}
      {subscription.plan.id === GOLD_PLAN_ID && <Typography>Plan: Gold</Typography>}
      <Typography>Status: {subscription.status}</Typography>
      <Typography fontSize={'0.8rem'}>Created: {unixToHuman(subscription.created)}</Typography>
      <Typography fontSize={'0.8rem'}>Current Period Start: {unixToHuman(subscription.current_period_start)}</Typography>
      <Typography fontSize={'0.8rem'}>Current Period End: {unixToHuman(subscription.current_period_end)}</Typography>
      <Typography fontSize={'0.8rem'}>Subscription ID: {subscription.id}</Typography>
      {subscription.status === 'active' && <CreatePortalSessionButton />}
    </div>
  );
};

export default SubscriptionCard;
