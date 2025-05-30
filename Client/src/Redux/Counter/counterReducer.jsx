import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  USER_LOADED_FAIL,
  USER_LOADED_SUCCESS,
  LOGOUT,
  CAR,
  DELIVERY,
} from './counterActionTypes';

// Initial state
const initialState = {
  loggedIn: false,
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  isAuthenticated: false,
  phone: localStorage.getItem('phone'),
  car: localStorage.getItem('car') === 'true', // Convert string to boolean
  delivery: localStorage.getItem('delivery') === 'true', // Convert string to boolean
};

const counterReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CAR:
      localStorage.setItem('car', payload);
      return {
        ...state,
        car: payload,
      };

    case DELIVERY:
      localStorage.setItem('delivery', payload);
      return {
        ...state,
        delivery: payload,
      };

    case LOGIN_SUCCESS:
      localStorage.setItem('access', payload.access);
      localStorage.setItem('refresh', payload.refresh);
      localStorage.setItem('phone', payload.phone);
      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
        phone: payload.phone,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };

    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };

    case USER_LOADED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };

    case USER_LOADED_FAIL:
    case AUTHENTICATED_FAIL:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      return {
        ...state,
        isAuthenticated: false,
      };

    case LOGOUT:
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('phone');
      console.log('Logout successful');
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        phone: null,
      };

    default:
      return state;
  }
};

export default counterReducer;