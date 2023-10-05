import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthenticationContext } from './../context/AuthenticationContext';
import { toast } from 'react-hot-toast';

const AccountActivationScreen = () => {
  const { tokenId } = useParams();
  const { isAuthenticated, setIsAuthenticated, setAccessToken, saveInfoAtLocalStorage } = useAuthenticationContext();
  const [error, setError] = useState(false);

  const activateAccount = async (tokenId) => {
    try {
      const {
        data: { token },
      } = await axios.get(`/api/users/activate/${tokenId}`);
      setIsAuthenticated(true);
      setAccessToken(token);
      saveInfoAtLocalStorage(token);
      toast.success('Your account has been activated!');
    } catch (error) {
      toast.error(error.response.data.error_message);
      console.error(error.response.status, error.response.data.error_message);
      setError(true);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated && navigate('/home');
  }, [isAuthenticated]);

  useEffect(() => {
    activateAccount(tokenId);
  }, []);

  return error ? (
    <div>Sorry something went wrong</div>
  ) : (
    <div>Thank you for activating your account. Just wait and if everything is alright you will be redirected</div>
  );
};

export default AccountActivationScreen;
