import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MuiCustomTheme from './theme/MuiCustomTheme';
import { InternalToaster } from './components/ui/InternalToaster';
import AdminComponent from './components/admin/AdminComponent';
import SignInComponent from './components/admin/SignInComponent';
import SignUpComponent from './components/admin/SignUpComponent';
import AuthenticationProvider from './context/AuthenticationContext';
import { ProtectedRoute } from './components/AuthRoutes';
import SubscriptionScreen from './components/stripe/SubscriptionScreen';
import ScgTierProvider from './context/ScgTierContext';

function App() {
  return (
    <MuiCustomTheme>
      <InternalToaster />
      <Router>
        <AuthenticationProvider>
          <ScgTierProvider>
            <Routes>
              <Route path='/' element={<SignInComponent />} />
              <Route
                path='/admin'
                element={
                  <ProtectedRoute redirectTo='/'>
                    <AdminComponent />
                  </ProtectedRoute>
                }
              />
              <Route path='/sign-up' element={<SignUpComponent />} />
              <Route path='/subscriptions' element={<SubscriptionScreen />} />
              <Route path='/*' element={<>404</>} />
            </Routes>
          </ScgTierProvider>
        </AuthenticationProvider>
      </Router>
    </MuiCustomTheme>
  );
}

export default App;
