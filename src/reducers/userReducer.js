import {
	SET_TOP_TRACKS,
	SET_MY_PLAYLISTS,
	SET_OPEN_PLAYLISTS,
	ADD_TO_OPEN_PLAYLISTS,
	REMOVE_FROM_OPEN_PLAYLISTS,
	TOGGLE_PLAYLIST,
	ADD_TO_MY_PLAYLISTS,
	REMOVE_FROM_MY_PLAYLISTS,
	ADD_TO_RATED_BY
} from '../actions/types';
const initialState = {
	myTopTracks: [],
	myPlaylists: [],
	openPlaylists: [],
	similarUsers: []
};

const getUpdatedOpenPlaylists = (state, action) => {
	return state.openPlaylists.map((playlist, index) => {
		if (index !== action.payload.index) {
			return playlist;
		}
		return action.payload.data;
	});
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

		case ADD_TO_MY_PLAYLISTS:
			return {
				...state,
				myPlaylists: [ ...state.myPlaylists, action.payload ]
			};
		case REMOVE_FROM_MY_PLAYLISTS:
			return {
				...state,
				myPlaylists: [
					...state.myPlaylists.slice(0, action.payload),
					...state.myPlaylists.slice(action.payload + 1)
				]
			};
		case TOGGLE_PLAYLIST:
			return {
				...state,
				myPlaylists: state.myPlaylists.map(
					(playlist, index) =>
						index === action.payload.index ? { ...playlist, open: action.payload.val } : playlist
				)
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

		case ADD_TO_RATED_BY:
			return {
				...state,
				openPlaylists: getUpdatedOpenPlaylists(state, action)
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
