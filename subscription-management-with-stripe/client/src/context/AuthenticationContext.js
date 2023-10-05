import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

const AuthenticationContext = createContext();

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAccountNotActivatedOnLogin, setIsAccountNotActivatedOnLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [fullName, setFullName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [successfulSignUpModal, setSuccessfulSignUpModal] = useState(false);

  const accessTokenFromCookies = localStorage.getItem('token');

  useEffect(() => {
    if (accessTokenFromCookies) {
      if (window.location.pathname === '/logout') {
        logout();
        setIsAuthLoading(false);
      } else {
        whoAmI(accessTokenFromCookies);
      }
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const whoAmI = async (token) => {
    try {
      const {
        data: { user, userSubscriptions },
      } = await axios.get('/api/users/who-am-i', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(userSubscriptions);
      setEmail(user.email);
      setFullName(user.fullName);
      setUserSubscriptions(userSubscriptions);
      setAccessToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
      if (error.response.status === 401) {
        toast.error(`Your session has expired.\n Please log in.`);
      }
    }
    setIsAuthLoading(false);
  };

  const login = async (email, password) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const { data } = await axios.post(
        `api/users/login`,
        {
          email,
          password,
        },
        headers
      );
      setAccessToken(data.token);
      setEmail(data.email);
      setFullName(data.fullName);
      saveInfoAtLocalStorage(data.token);
      setIsAdmin(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error.response.status, error.response.data.error_message);
      toast.error(error.response.data?.error_message);
      if (error.response.status === 403) console.log('Cannot login');
      if (error.response?.data?.error_message?.includes('not activated')) setIsAccountNotActivatedOnLogin(true);
    }
  };

  const register = async (fullName, email, password) => {
    console.log('Trying to register');
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const { data } = await axios.post(
        `/api/users/register`,
        {
          fullName,
          email,
          password,
        },
        headers
      );
      setFullName(fullName);
      console.log(data);
      toast.success('You registered as admin successfully!');
    } catch (error) {
      toast.error(error.response.data.error_message);
      console.error(error.response.status, error.response.data.message);
      if (error.response.status === 403) console.log('Cannot register');
    }
  };

  const saveInfoAtLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAccessToken('');
    toast('Goodbye!');
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  axios.defaults.baseURL =
    process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_SERVER_URL : `${process.env.REACT_APP_LOCAL_SERVER_URL}:4000`;
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  return (
    <AuthenticationContext.Provider
      value={{
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        accessToken,
        config,
        email,
        userSubscriptions,
        fullName,
        isAccountNotActivatedOnLogin,
        setIsAccountNotActivatedOnLogin,
        successfulSignUpModal,
        setSuccessfulSignUpModal,
      }}
    >
      {isAuthLoading ? <CircularProgress /> : children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
