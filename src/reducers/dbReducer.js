import { SET_REGISTERED_USERS } from '../actions/types';
const initialState = {
	registeredUsers: []
};
export default function(state = initialState, action) {
	switch (action.type) {
		case SET_REGISTERED_USERS:
			return {
				...state,
				registeredUsers: [ ...action.payload ]
			};

		default:
			return state;
	}
}
