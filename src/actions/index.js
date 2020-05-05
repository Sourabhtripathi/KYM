import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER, USER_NOT_LOADING, SET_TOP_TRACKS } from './types';

// set Users top tracks
export const setMyTopTracks = (data) => (dispatch) => {
	dispatch({ type: SET_TOP_TRACKS, payload: data });
};

// User not loading
export const setUserNotLoading = () => (dispatch) => {
	dispatch({
		type: USER_NOT_LOADING,
		payload: null
	});
};

// Login
export const loginUser = (id) => (dispatch) => {
	dispatch({ type: SET_CURRENT_USER, payload: id });
};

// Log user out
export const logoutUser = () => (dispatch) => {
	localStorage.removeItem('jwtToken');
	dispatch({ type: SET_CURRENT_USER, payload: null });
};
