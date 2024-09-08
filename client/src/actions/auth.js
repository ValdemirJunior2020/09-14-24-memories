// src/actions/auth.js
import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js'; // Ensure this import is correct

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    router.push('/'); // Redirect to homepage after successful signin
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Signin error:', error); // Log errors
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    router.push('/'); // Redirect to homepage after successful signup
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Signup error:', error); // Log errors
  }
};
