import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  LOGOUT,
  CAR,
  DELIVERY,
} from './counterActionTypes';
import { API_URL } from '../../config';
// import { getToken } from 'firebase/messaging';
// import { messaging } from '../../firebase/firebaseConfig';

// Helper function to set headers
const getAuthConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Load user data if access token exists
export const load_user = () => async (dispatch) => {
  if (localStorage.getItem('access')) {
    try {
      const response = await axios.post(
        `http://${API_URL}/api/token/refresh/`,
        { refresh: localStorage.getItem('refresh') },
        getAuthConfig()
      );

      if (response.status === 200) {
        dispatch({ type: USER_LOADED_SUCCESS });
      } else {
        dispatch({ type: USER_LOADED_FAIL });
      }
    } catch (error) {
      dispatch({ type: USER_LOADED_FAIL });
    }
  } else {
    dispatch({ type: USER_LOADED_FAIL });
  }
};

// Check if the user is authenticated
export const checkAuthenticated = () => async (dispatch) => {
  if (localStorage.getItem('access')) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const body = JSON.stringify({ token: localStorage.getItem('access') });

    try {
      const res = await axios.post(
        `http://${API_URL}/api/token/verify/`,
        body,
        config
      );

      if (res.data.code !== 'token_not_valid') {
        dispatch({ type: AUTHENTICATED_SUCCESS });
      } else {
        dispatch({ type: AUTHENTICATED_FAIL });
      }
    } catch (err) {
      dispatch({ type: AUTHENTICATED_FAIL });
    }
  } else {
    dispatch({ type: AUTHENTICATED_FAIL });
  }
};

// Login user
export const login = (phone, password) => async (dispatch) => {
  const body = JSON.stringify({ phone, password });

  try {
    const res = await axios.post(
      `http://${API_URL}/api/token/`,
      body,
      getAuthConfig()
    );

    const resData = {
      ...res.data,
      phone,
    };

    dispatch({
      type: LOGIN_SUCCESS,
      payload: resData,
    });

    await sendFCMTokenToServer(phone); // Send FCM token after successful login
  } catch (err) {
    console.error('Login failed:', err);
    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Set car state
export const Car = (payload) => (dispatch) => {
  dispatch({ type: CAR, payload });
};

// Set delivery state
export const Delivery = (payload) => (dispatch) => {
  dispatch({ type: DELIVERY, payload });
};

// Request notification permission and get FCM token
// async function requestPermission() {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       const token = await getToken(messaging);
//       console.log('FCM Token:', token);
//       return token;
//     } else {
//       console.log('Notification permission denied.');
//     }
//   } catch (error) {
//     console.error('Error requesting permission:', error);
//   }
// }

// Send FCM token to the server
const sendFCMTokenToServer = async (phoneNumber) => {
  try {
    const token = await requestPermission();

    if (!token) {
      console.error('No FCM token available.');
      return;
    }

    const data = JSON.stringify({ code: token });

    const response = await fetch(
      `http://${API_URL}/accounts/create_FMC/${phoneNumber}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      }
    );

    if (response.ok) {
      console.log('FCM token sent successfully.');
    } else {
      console.error('Failed to send FCM token.');
    }
  } catch (error) {
    console.error('Error sending FCM token:', error);
  }
};