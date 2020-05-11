import { SET_CURRENT_USER, USER_NOT_LOADING, SET_TOP_TRACKS, SET_MY_PLAYLISTS, ADD_TO_OPEN_PLAYLISTS } from './types';

// set Users top tracks
export const setMyTopTracks = (data) => (dispatch) => {
	dispatch({ type: SET_TOP_TRACKS, payload: data });
};

// set Users playlists
export const setMyPlaylists = (data) => (dispatch) => {
	dispatch({ type: SET_MY_PLAYLISTS, payload: data });
};

export const addToOpenPlaylists = (data) => (dispatch) => {
	dispatch({ type: ADD_TO_OPEN_PLAYLISTS, payload: data });
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
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('token_expire_time');
	dispatch({ type: SET_CURRENT_USER, payload: null });
};
