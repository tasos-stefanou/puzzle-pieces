import React, { useState } from 'react';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

const CreatePortalSessionButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const goToSessionPortal = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/stripe/create-portal-session');
      console.log(data);
      window.location = data.url;
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <LoadingButton loading={isLoading} variant='contained' onClick={goToSessionPortal}>
      Manage subscriptions
    </LoadingButton>
  );
};

export default CreatePortalSessionButton;
