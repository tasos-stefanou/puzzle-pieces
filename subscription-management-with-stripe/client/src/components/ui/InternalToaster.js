import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

const InternalToaster = () => {
  return (
    <Toaster
      position='top-center'
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: 'green',
            color: '#fff',
          },
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: 'red',
            color: '#fff',
          },
          theme: {
            primary: 'red',
            secondary: 'red',
          },
        },
      }}
    />
  );
};

const internalToast = toast;

export { InternalToaster, internalToast };
