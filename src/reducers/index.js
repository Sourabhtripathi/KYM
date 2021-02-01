import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import dbReducer from './dbReducer';
export default combineReducers({
	auth: authReducer,
	user: userReducer,
	db: dbReducer
});
