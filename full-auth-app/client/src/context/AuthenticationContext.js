import React, { useState, useEffect, useContext, createContext } from 'react';
import { toast } from 'react-hot-toast';

const AuthenticationContext = createContext();

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const accessTokenFromCookies = localStorage.getItem('token');

    if (accessTokenFromCookies !== null) {
      setAccessToken(accessTokenFromCookies);
      setIsAuthenticated(true);
    }
  }, []);

  const saveInfoAtLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAccessToken('');
    toast('Goodbye!');
  };

  return (
    <AuthenticationContext.Provider
      value={{
        logout,
        isAuthenticated,
        setIsAuthenticated,
        accessToken,
        setAccessToken,
        saveInfoAtLocalStorage,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
