import { SET_CURRENT_USER, USER_LOADING, USER_NOT_LOADING, SET_DEVICE } from '../actions/types';
const isEmpty = require('is-empty');
const initialState = {
	device: null,
	isAuthenticated: false,
	user: {},
	loading: true
};
export default function(state = initialState, action) {
	switch (action.type) {
		case SET_DEVICE:
			return {
				...state,
				device: action.payload
			};
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				user: action.payload
			};
		case USER_LOADING:
			return {
				...state,
				loading: true
			};
		case USER_NOT_LOADING:
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
}
