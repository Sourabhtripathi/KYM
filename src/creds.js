export const config = {
	clientId: '549a4d6816834a4aa17ed83775760755',
	redirectUrl: 'https://knowyourmusic.netlify.app/callback',
	scopes: [
		'ugc-image-upload',
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'streaming',
		'app-remote-control',
		'user-read-email',
		'user-read-private',
		'playlist-read-collaborative',
		'playlist-modify-public',
		'playlist-read-private',
		'playlist-modify-private',
		'user-library-modify',
		'user-library-read',
		'user-top-read',
		'user-read-playback-position',
		'user-read-recently-played',
		'user-follow-read',
		'user-follow-modify'
	],
	// tokenExchangeUrl: 'http://localhost:3005/login',
	tokenExchangeUrl: 'https://kymserver.herokuapp.com/exchange',
	// tokenRefreshUrl: 'http://localhost:3005/refresh_token',
	tokenRefreshUrl: 'https://kymserver.herokuapp.com/refresh'
};
