import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MuiCustomTheme from './theme/MuiCustomTheme';
import LoginScreen from './screens/LoginScreen';
import AuthenticationProvider from './context/AuthenticationContext';
import HomeScreen from './screens/HomeScreen';
import AccountActivationScreen from './screens/AccountActivationScreen';
import { NonAuthRoute, ProtectedRoute } from './components/AuthRoutes';
import { InternalToaster } from './components/InternalToaster';
import axios from 'axios';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import PasswordlessLoginScreen from './screens/PasswordlessLoginScreen';
import LoginWithMagicLinkScreen from './screens/LoginWithMagicLinkScreen';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  return (
    <MuiCustomTheme>
      <div className='App'>
        <InternalToaster />
        <AuthenticationProvider>
          <Router>
            <Routes>
              <Route
                path='/'
                exact
                element={
                  <NonAuthRoute redirectTo='/home'>
                    <LoginScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/sign-up'
                exact
                element={
                  <NonAuthRoute redirectTo='/home'>
                    <SignUpScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/forgot-password'
                exact
                element={
                  <NonAuthRoute redirectTo='/home'>
                    <ForgotPasswordScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/passwordless-login'
                exact
                element={
                  <NonAuthRoute redirectTo='/home'>
                    <PasswordlessLoginScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/login-with-magic-link/:tokenId'
                exact
                element={
                  <NonAuthRoute redirectTo='/home'>
                    <LoginWithMagicLinkScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/reset-password/:token'
                exact
                element={
                  <NonAuthRoute redirectTo='/home'>
                    <ResetPasswordScreen />
                  </NonAuthRoute>
                }
              />
              <Route
                path='/home'
                exact
                element={
                  <ProtectedRoute redirectTo='/?redirectTo=/home'>
                    <HomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route path='/activate/:tokenId' exact element={<AccountActivationScreen />} />
            </Routes>
          </Router>
        </AuthenticationProvider>
      </div>
    </MuiCustomTheme>
  );
}

export default App;
