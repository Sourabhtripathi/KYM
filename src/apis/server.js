import axios from 'axios';

export default axios.create({
	// baseURL: 'http://localhost:3005'
	baseURL: 'https://kymserver.herokuapp.com'
});
