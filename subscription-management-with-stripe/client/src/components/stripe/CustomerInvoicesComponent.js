import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Typography,
  Link,
  Button,
  CircularProgress,
} from '@mui/material';
const CustomerInvoicesComponent = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getInvoices = async () => {
    try {
      const { data } = await axios.get('/api/stripe/get-invoices-of-user/');
      // console.log(data);
      setInvoices(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const unixToHuman = (unix) => {
    const date = new Date(unix * 1000);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return date.toLocaleString(undefined, options);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ width: 'fit-content' }}>
      <Typography variant='h5' gutterBottom>
        Customer Invoices
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {invoices.length === 0 && (
          <Typography variant='body1'>No invoices yet.</Typography>
        )}
        {invoices.map((invoice) => (
          <Grid
            container
            key={invoice.id}
            gap={2}
            alignItems={'center'}
            padding={2}
            className='shadowed'
          >
            <Grid>
              <Typography variant='body1'>
                {unixToHuman(invoice.created)}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant='body1'>
                {Math.floor(invoice.amount_paid / 100)}
              </Typography>
            </Grid>
            <Grid>
              {invoice.paid ? (
                <div
                  style={{
                    background: 'green',
                    color: 'white',
                    paddingInline: '0.5em',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant='body1'>Paid</Typography>
                </div>
              ) : (
                <div
                  style={{
                    background: 'red',
                    color: 'white',
                    paddingInline: '0.5em',
                    borderRadius: '4px',
                  }}
                >
                  <Typography variant='body1'>Pending</Typography>
                </div>
              )}
            </Grid>
            <Grid>
              <Link
                href={invoice.hosted_invoice_url}
                target='_blank'
                rel='noopener'
              >
                <Button variant='outlined' color='primary'>
                  View Invoice
                </Button>
              </Link>
            </Grid>
            <Grid>
              <Link href={invoice.invoice_pdf} target='_blank' rel='noopener'>
                <Button variant='contained' color='primary'>
                  Download PDF
                </Button>
              </Link>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
};

export default CustomerInvoicesComponent;
