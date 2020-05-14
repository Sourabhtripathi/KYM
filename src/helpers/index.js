import server from '../apis/server';
import isEmpty from 'is-empty';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// Auth Configuration
export const setAccessToken = (token) => {
	spotifyApi.setAccessToken(token);
};

export const setMe = () => {
	return spotifyApi.getMe().then((response) => {
		return response;
	});
};

export const getParams = () => {
	if (isEmpty(window.location.hash)) {
		return {};
	}
	const str = window.location.hash.substring(1);
	let pieces = str.split('&'),
		data = {},
		i,
		parts;
	// process each query pair
	for (i = 0; i < pieces.length; i++) {
		parts = pieces[i].split('=');
		if (parts.length < 2) {
			parts.push('');
		}
		data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	}
	return JSON.parse(Object.keys(data)[0]);
};

export const isValid = () => {
	const d = new Date();
	if (d.getTime() <= parseInt(localStorage.token_expire_time)) return true;
	return false;
};

export const calculateTimeLeft = () => {
	let timeLeft = 10;
	if (localStorage.accessToken && localStorage.accessToken !== NaN) {
		const difference = localStorage.token_expire_time - new Date().getTime();
		if (difference > 0) {
			timeLeft = difference;
		}
	}
	return timeLeft;
};

export const updateTokens = (params) => {
	let d = new Date();
	// d.setSeconds(d.getSeconds() + 30);
	d.setSeconds(d.getSeconds() + 3600);
	console.log(d.getTime());
	if (!params.refreshToken) {
		// refreshed token-- just change access token and time
		localStorage.setItem('accessToken', params.accessToken);
		localStorage.setItem('token_expire_time', d.getTime());
		window.close();
	} else {
		localStorage.setItem('accessToken', params.accessToken);
		localStorage.setItem('refreshToken', params.refreshToken);
		localStorage.setItem('token_expire_time', d.getTime());
	}
};

// Fetch content from spotify api

export const getMyTopTracks = (user) => {
	const obj = {
		limit: 10
	};
	return spotifyApi.getMyTopTracks(obj).then(async (response) => {
		await server.put(`/setTopTracks?spotifyId=${user}`, {
			topTracks: response.items
		});
		return response;
	});
};

export const getUserPlaylists = (user) => spotifyApi.getUserPlaylists(user).then((res) => res.items);

// Fetch playlist details
export const getPlaylist = (pid) => spotifyApi.getPlaylist(pid).then((response) => response);

export const areFollowingPlaylist = (pid, users) =>
	spotifyApi.areFollowingPlaylist(pid, users).then((response) => response);

export const followPlaylist = (pid) => spotifyApi.followPlaylist(pid).then((response) => response);

export const unfollowPlaylist = (pid) => spotifyApi.unfollowPlaylist(pid).then((response) => response);

// Api requests on own server
export const addOpenPlaylist = async (body) => {
	const response = await server.post('/add_open_playlist', body);
	console.log(response);
	return response;
};

export const removeOpenPlaylist = async (pid) => {
	const response = await server.delete(`/remove_open_playlist/${pid}`);
	return response;
};

export const getOpenPlaylists = async () => {
	const response = await server.get('/open_playlists');
	return response;
};

export const getOpenPlaylist = async (pid) => {
	const response = await server.get(`/open_playlist/${pid}`);
	return response;
};

export const addRating = async (pid, uid, rating) => {
	const body = {
		userId: uid,
		rating: rating
	};
	const response = await server.put(`/open_playlist/rate/${pid}`, body);
	return response;
};
// General functions

export const found = (array, value) => {
	let retVal;
	for (const i in array) {
		if (array[i].playlistId === value) {
			retVal = true;
			break;
		} else {
			retVal = false;
		}
	}
	return retVal;
};

export const compareValues = (a, b) => {
	if (a > b) return b - a;
	else return a - b;
};
