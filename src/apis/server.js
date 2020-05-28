import axios from 'axios';
import { serverUrl } from '../variables';

export default axios.create({
	baseURL: serverUrl
});
