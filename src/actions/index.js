import {
	SET_CURRENT_USER,
	USER_NOT_LOADING,
	USER_LOADING,
	SET_TOP_TRACKS,
	SET_MY_PLAYLISTS,
	SET_OPEN_PLAYLISTS,
	ADD_TO_OPEN_PLAYLISTS,
	REMOVE_FROM_OPEN_PLAYLISTS,
	TOGGLE_PLAYLIST,
	ADD_TO_MY_PLAYLISTS,
	REMOVE_FROM_MY_PLAYLISTS,
	ADD_TO_RATED_BY,
	SET_REGISTERED_USERS,
	SET_DEVICE
} from './types';
import { removeStorage } from '../helpers';

// set Device
export const setDevice = (data) => (dispatch) => {
	dispatch({ type: SET_DEVICE, payload: data });
};

// set Registered Users
export const setRegisteredUsers = (data) => (dispatch) => {
	dispatch({ type: SET_REGISTERED_USERS, payload: data });
};

// set Users top tracks
export const setMyTopTracks = (data) => (dispatch) => {
	dispatch({ type: SET_TOP_TRACKS, payload: data });
};

// set User's Playlists
export const setMyPlaylists = (data) => (dispatch) => {
	console.log('data');
	dispatch({ type: SET_MY_PLAYLISTS, payload: data });
};

// Add to User's Playlists
export const addToMyPlaylists = (data) => (dispatch) => {
	dispatch({ type: ADD_TO_MY_PLAYLISTS, payload: data });
};

// Remove from My Playlists
export const removeFromMyPlaylists = (i) => (dispatch) => {
	dispatch({ type: REMOVE_FROM_MY_PLAYLISTS, payload: i });
};

// toggle my playlist
export const togglePlaylist = (data) => (dispatch) => {
	dispatch({ type: TOGGLE_PLAYLIST, payload: data });
};

// Set Open Playlists
export const setOpenPlaylists = (data) => (dispatch) => {
	dispatch({ type: SET_OPEN_PLAYLISTS, payload: data });
};

// Add to Open Playlists
export const addToOpenPlaylists = (data) => (dispatch) => {
	dispatch({ type: ADD_TO_OPEN_PLAYLISTS, payload: data });
};

// Update rated by of open playlist
export const addToRatedBy = (data) => (dispatch) => {
	dispatch({ type: ADD_TO_RATED_BY, payload: data });
};

// Remove from Open Playlists
export const removeFromOpenPlaylists = (i) => (dispatch) => {
	dispatch({ type: REMOVE_FROM_OPEN_PLAYLISTS, payload: i });
};

// User not loading
export const setUserNotLoading = () => (dispatch) => {
	dispatch({
		type: USER_NOT_LOADING,
		payload: null
	});
};

// User Loading
export const setUserLoading = () => (dispatch) => {
	dispatch({
		type: USER_LOADING,
		payload: null
	});
};

// Login
export const loginUser = (id) => (dispatch) => {
	dispatch({ type: SET_CURRENT_USER, payload: id });
};

// Log user out
export const logoutUser = (device) => async (dispatch) => {
	if (device === 'web') {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('token_expire_time');
	} else if (device === 'android' || device === 'ios') {
		removeStorage('access_token');
		removeStorage('refresh_token');
		removeStorage('token_expire_time');
	}

	dispatch({ type: SET_CURRENT_USER, payload: null });
};
