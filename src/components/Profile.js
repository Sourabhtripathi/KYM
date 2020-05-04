import React, { useState, useEffect } from 'react';
import { logoutUser } from '../actions';
import { connect } from 'react-redux';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Profile = (props) => {
	const [ type, setType ] = useState('playlists');

	useEffect(() => {}, [ type ]);

	const onLogoutClick = () => {
		props.logoutUser();
		props.history.push('/');
	};
	return (
		<div>
			<h1>Profile</h1>
			<button onClick={onLogoutClick}>Logout</button>
		</div>
	);
};
export default connect(null, { logoutUser })(Profile);
