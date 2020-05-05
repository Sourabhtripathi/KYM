import { SET_TOP_TRACKS } from '../actions/types';
const initialState = {
	myTopTracks: []
};
export default function(state = initialState, action) {
	switch (action.type) {
		case SET_TOP_TRACKS:
			return {
				...state,
				myTopTracks: action.payload
			};

		default:
			return state;
	}
}
