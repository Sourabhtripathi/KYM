import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Library = () => {
	const [ type, setType ] = useState('playlists');

	useEffect(() => {}, [ type ]);
	return <div>Library</div>;
};
export default Library;
