import React, { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';

import { useAuthenticationContext } from './AuthenticationContext';
import { CircularProgress } from '@mui/material';

const NO_PLAN = '';
const BRONZE = 'BRONZE';
const SILVER = 'SILVER';
const GOLD = 'GOLD';
const ERROR = 'ERROR';

const ScgTierContext = createContext();

export const useScgTierContext = () => {
  return useContext(ScgTierContext);
};

const ScgTierProvider = ({ children }) => {
  const { userSubscriptions } = useAuthenticationContext();
  const [userPlan, setUserPlan] = useState(NO_PLAN);
  const [BRONZE_PLAN_ID, setBRONZE_PLAN_ID] = useState('');
  const [SILVER_PLAN_ID, setSILVER_PLAN_ID] = useState('');
  const [GOLD_PLAN_ID, setGOLD_PLAN_ID] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  console.log('userSubscriptions', typeof userSubscriptions);

  const getSubscriptionPlanIDs = async () => {
    console.log('MPHKE');
    try {
      const { data } = await axios.get('/api/stripe/get-subscription-plan-ids');
      setBRONZE_PLAN_ID(data.BRONZE_PLAN_ID);
      setSILVER_PLAN_ID(data.SILVER_PLAN_ID);
      setGOLD_PLAN_ID(data.GOLD_PLAN_ID);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const activeSubscriptions = userSubscriptions.filter((s) => s.status === 'active');

  let activePlanOfUser = '';
  if (activeSubscriptions.length !== 0) {
    activePlanOfUser =
      activeSubscriptions[0].plan.id === SILVER_PLAN_ID
        ? 'SILVER'
        : activeSubscriptions[0].plan.id === BRONZE_PLAN_ID
        ? 'BRONZE'
        : activeSubscriptions[0].plan.id === GOLD_PLAN_ID
        ? 'GOLD'
        : '';
  } else {
    activePlanOfUser = 'FREE';
  }

  useEffect(() => {
    getSubscriptionPlanIDs();
  }, []);

  useEffect(() => {
    if (userSubscriptions === undefined) return;
    const activeSubscriptions = userSubscriptions.filter((s) => s.status === 'active');
    if (activeSubscriptions.length === 0) setUserPlan(NO_PLAN);
    else if (activeSubscriptions.length === 1) setUserPlan(BRONZE);
    else if (activeSubscriptions.length === 2) setUserPlan(SILVER);
    else if (activeSubscriptions.length >= 3) setUserPlan(ERROR);
  }, [userSubscriptions]);

  if (userPlan === ERROR) return <div>ERROR</div>;

  if (isLoading) return <CircularProgress />;

  console.log('userPlan', userPlan);

  return (
    <ScgTierContext.Provider
      value={{
        NO_PLAN,
        BRONZE,
        SILVER,
        GOLD,
        userPlan,
        BRONZE_PLAN_ID,
        SILVER_PLAN_ID,
        GOLD_PLAN_ID,
        activePlanOfUser,
        activeSubscriptions,
      }}
    >
      {children}
    </ScgTierContext.Provider>
  );
};

export default ScgTierProvider;
