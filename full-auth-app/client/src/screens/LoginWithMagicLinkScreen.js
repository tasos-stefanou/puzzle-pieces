import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthenticationContext } from '../context/AuthenticationContext';

const LoginWithMagicLinkScreen = () => {
  const { tokenId } = useParams();
  const { isAuthenticated, setIsAuthenticated, setAccessToken, saveInfoAtLocalStorage } = useAuthenticationContext();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const loginWithMagicLink = async () => {
    try {
      const {
        data: { token },
      } = await axios.get(
        // TODO: make that env var
        `/api/users/login-with-magic-link/${tokenId}`
      );
      setIsAuthenticated(true);
      setAccessToken(token);
      saveInfoAtLocalStorage(token);
      toast.success('Welcome!');
    } catch (error) {
      toast.error(error.response.data.error_message);
      setError(true);
    }
  };

  useEffect(() => {
    isAuthenticated && navigate('/home');
  }, [isAuthenticated]);

  useEffect(() => {
    loginWithMagicLink(tokenId);
  }, []);

  return error ? <div>Sorry something went wrong</div> : <div> Just wait and if everything is alright you will be redirected</div>;
};
export default LoginWithMagicLinkScreen;
