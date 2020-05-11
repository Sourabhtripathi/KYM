import {
	SET_TOP_TRACKS,
	SET_MY_PLAYLISTS,
	SET_OPEN_PLAYLISTS,
	ADD_TO_OPEN_PLAYLISTS,
	REMOVE_FROM_OPEN_PLAYLISTS
} from '../actions/types';
const initialState = {
	myTopTracks: [],
	myPlaylists: [],
	openPlaylists: [],
	similarUsers: []
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
		case SET_OPEN_PLAYLISTS:
			return {
				...state,
				openPlaylists: action.payload
			};

		case ADD_TO_OPEN_PLAYLISTS:
			return {
				...state,
				openPlaylists: [ ...state.openPlaylists, action.payload ]
			};
		case REMOVE_FROM_OPEN_PLAYLISTS:
			return {
				...state,
				openPlaylists: [
					...state.openPlaylists.slice(0, action.payload),
					...state.openPlaylists.slice(action.payload + 1)
				]
			};
		default:
			return state;
	}
}
