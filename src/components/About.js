import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const About = () => {
	const [ type, setType ] = useState('playlists');

	useEffect(() => {}, [ type ]);
	return <div>About</div>;
};
export default About;
