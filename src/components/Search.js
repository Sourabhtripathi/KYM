import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Search = () => {
	const [ type, setType ] = useState('playlists');

	useEffect(() => {}, [ type ]);
	return <div>Search</div>;
};
export default Search;
