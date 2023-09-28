import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  // `pk_test_51KEbDEIprCE5xXODYZMgB96rf1TlAergizSkY56XbiW77fRILJnHvTrORpO0rCjrA1sKMbgvPUtXCs2RAT4Dk8GB00CpeJwbPu`
  `pk_test_51JSHsFFTun8dXRXwJnMx9jABZhsXy2rST2RAOTTcXXMZLEh2ueTbIRXUnEfU2HZAEJM2fzHLtlun7M63LWox29pm00F8Ev1LWm`
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>
);
