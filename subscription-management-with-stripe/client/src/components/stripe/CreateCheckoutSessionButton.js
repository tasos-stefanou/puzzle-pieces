import React, { useState } from 'react';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

const CreateCheckoutSessionButton = ({ label, planName, color = 'primary' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async () => {
    setIsLoading(true);

    const body = {
      plan: planName,
    };

    try {
      const response = await axios.post('/api/stripe/create-subscription-session', body);

      window.location = response.data.url;
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  if (!label || !planName) return <>Please provide label and plan name</>;

  return (
    <>
      <LoadingButton variant='contained' loading={isLoading} onClick={handleSelect} color={color}>
        {label}
      </LoadingButton>
    </>
  );
};

export default CreateCheckoutSessionButton;
