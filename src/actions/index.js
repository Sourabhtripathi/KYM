import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER, USER_NOT_LOADING } from './types';

// Login - get user token
export const loginUser = (id) => (dispatch) => {
	// Decode token to get user data
	// Set current user
	dispatch({ type: SET_CURRENT_USER, payload: id });
};

// User not loading
export const setUserNotLoading = () => (dispatch) => {
	dispatch({
		type: USER_NOT_LOADING,
		payload: null
	});
};

// Log user out
export const logoutUser = () => (dispatch) => {
	// Remove token from local storage
	localStorage.removeItem('jwtToken');
	// Remove auth header for future requests
	// Set current user to empty object {} which will set isAuthenticated to false
	dispatch({ type: SET_CURRENT_USER, payload: null });
};
