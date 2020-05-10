import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
// import SpotifyWebApi from 'spotify-web-api-js';
// const spotifyApi = new SpotifyWebApi();

const Discover = (props) => {
	const [ type, setType ] = useState('playlists');

	useEffect(
		() => {
			// fetch playlists from top_playlists databse
			if (type === 'playlists') {
			}
		},
		[ type ]
	);

	const onTabSwitch = (val) => {
		setType(val);
	};
	return (
		<div>
			<h1>Discover</h1>
			<div>
				<button disabled={type === 'playlists' ? true : false} onClick={() => onTabSwitch('playlists')}>
					Playlists
				</button>
				<button disabled={type === 'users' ? true : false} onClick={() => onTabSwitch('users')}>
					Similar Users
				</button>
			</div>
			<ul>
				<h3>Top {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
				{/* {props.user.myTopTracks.map((track, index) => {
					return <li key={index}>{track.name}</li>;
				})} */}
			</ul>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
		auth: state.auth
	};
};
export default connect(mapStateToProps)(Discover);
