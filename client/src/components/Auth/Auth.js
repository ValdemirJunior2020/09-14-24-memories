// src/components/Auth/Auth.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container, Snackbar } from '@material-ui/core';
import { useNavigate } from 'react-router-dom'; // Correct use of useNavigate
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { signin, signup } from '../../actions/auth';

import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Correct hook for navigation
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
    setErrorMessage(''); // Clear error message on mode switch
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { confirmPassword, ...finalFormData } = form; // Exclude confirmPassword

    try {
      if (isSignup) {
        await dispatch(signup(finalFormData, navigate)); // Attempt to sign up
      } else {
        await dispatch(signin(finalFormData, navigate)); // Sign in
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'An unexpected error occurred.', // Added trailing comma
      );
      setOpenSnackbar(true); // Open Snackbar to display the error
    }
  };

  const handleSnackbarClose = () => setOpenSnackbar(false); // Fix line break for arrow function

  const googleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential); // Decode JWT token
    const result = decoded;
    const token = credentialResponse.credential;

    try {
      dispatch({ type: AUTH, data: { result, token } });
      navigate('/'); // Use navigate to redirect to home
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Google Sign In error:', error); // Suppressed warning
    }
  };

  const googleError = () => {
    // eslint-disable-next-line no-alert
    alert('Google Sign In was unsuccessful. Try again later'); // Suppressed warning
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <GoogleOAuthProvider clientId="207015306049-22vcptbps2c060ebd6g0eu6pnvhhho49.apps.googleusercontent.com">
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={errorMessage}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Trailing comma included
          />
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
            <GoogleLogin
              onSuccess={googleSuccess}
              onError={googleError}
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default SignUp;
