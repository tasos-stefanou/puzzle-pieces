import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useScgTierContext } from '../../context/ScgTierContext';
import SubscriptionCard from './SubscriptionCard';

const ExistingSubscriptionsComponent = () => {
  const { userSubscriptions } = useScgTierContext();
  console.log('userSubscriptions', userSubscriptions);
  const [BRONZE_PLAN_ID, setBRONZE_PLAN_ID] = useState('');
  const [SILVER_PLAN_ID, setSILVER_PLAN_ID] = useState('');
  const [GOLD_PLAN_ID, setGOLD_PLAN_ID] = useState('');
  const getSubscriptionPlanIDs = async () => {
    try {
      const { data } = await axios.get('/api/stripe/get-subscription-plan-ids');
      console.log('data', data);
      setBRONZE_PLAN_ID(data.BRONZE_PLAN_ID);
      setSILVER_PLAN_ID(data.SILVER_PLAN_ID);
      setGOLD_PLAN_ID(data.GOLD_PLAN_ID);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscriptionPlanIDs();
  }, []);

  const activeSubscriptions = userSubscriptions.filter((s) => s.status === 'active');
  // const canceledSubs = userSubscriptions.filter((s) => s.status === 'canceled');

  if (userSubscriptions.length === 0) {
    return <div>No subscriptions</div>;
  }

  return (
    <>
      <h1>Subscription Plan</h1>
      <SubscriptionCard
        subscription={activeSubscriptions[0]}
        BRONZE_PLAN_ID={BRONZE_PLAN_ID}
        SILVER_PLAN_ID={SILVER_PLAN_ID}
        GOLD_PLAN_ID={GOLD_PLAN_ID}
      />
      {/* {userSubscriptions.filter((s) => s.status === 'canceled').length > 0 && <h3>Past subscriptions</h3>}
      <div style={{ display: 'flex', gap: '1em' }}>
        {userSubscriptions
          .filter((s) => s.status === 'canceled')
          // ...this is to sort the subscriptions by created date
          .sort((a, b) => a.created - b.created)
          .map((s) => {
            return <SubscriptionCard key={s.id} subscription={s} BRONZE_PLAN_ID={BRONZE_PLAN_ID} SILVER_PLAN_ID={SILVER_PLAN_ID} GOLD_PLAN_ID={GOLD_PLAN_ID} />;
          })}
      </div> */}
    </>
  );
};

export default ExistingSubscriptionsComponent;
