import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography } from '@mui/material';
import classes from '../css/RegistrantsGrid.module.css';
import { useAuthenticationContext } from '../../context/AuthenticationContext';
import { Link } from 'react-router-dom';

const AdminComponent = () => {
  const { logout } = useAuthenticationContext();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get('/api/users');
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginBlock: '2em' }}>
      <Grid container gap={'3em'} flexDirection='column'>
        <Grid item sx={{ display: 'flex', gap: '2em', justifyContent: 'flex-end' }}>
          <Button variant='contained' onClick={logout}>
            Logout
          </Button>
          <Link to={'/subscriptions'}>
            <Button variant='contained'>Subscriptions</Button>
          </Link>
        </Grid>
        <Grid item alignSelf='center' gap='3em' flexDirection='column'>
          <Typography variant='totalRegistrants'>Total Users: {users.length}</Typography>
        </Grid>
        <div className={classes.registrantsGridContainer}>
          <div className={classes.registrantsGridContainerList}>
            <div className={classes.registrantsGridContainerTitles}>
              <Typography variant='RegistrantsListSectionTitle'>Full name</Typography>
              <Typography variant='RegistrantsListSectionTitle'>Email</Typography>
              <Typography variant='RegistrantsListSectionTitle'>Subscription</Typography>
            </div>
            {users.map((user) => (
              <div key={user._id} className={classes.ListViewRegistrants + ' shadowed'}>
                <Typography variant='registrantTitle'>{user.fullName}</Typography>
                <Typography variant='registrantTitle'>{user.email}</Typography>
                <Typography variant='registrantTitle'>Subscription</Typography>
              </div>
            ))}
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default AdminComponent;
