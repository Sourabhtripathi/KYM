import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Discover = () => {
	const [ type, setType ] = useState('playlists');

	useEffect(
		() => {
			// fetch playlists from top_playlists databse
		},
		[ type ]
	);
	return <div>Discover</div>;
};
export default Discover;
