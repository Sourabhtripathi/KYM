import { SET_TOP_TRACKS, SET_MY_PLAYLISTS } from '../actions/types';
const initialState = {
	myTopTracks: [],
	myPlaylists: []
};
export default function(state = initialState, action) {
	switch (action.type) {
		case SET_TOP_TRACKS:
			return {
				...state,
				myTopTracks: action.payload
			};
		case SET_MY_PLAYLISTS:
			return {
				...state,
				myPlaylists: action.payload
			};
		default:
			return state;
	}
}
