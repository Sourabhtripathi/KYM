import React, { useState, useEffect } from 'react';
import { setMyTopTracks } from '../actions';
import { connect } from 'react-redux';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Discover = (props) => {
	const [ type, setType ] = useState('playlists');

	useEffect(
		() => {
			// fetch playlists from top_playlists databse
			const obj = {
				limit: 10
			};
			spotifyApi.getMyTopTracks(obj).then((response) => {
				props.setMyTopTracks(response.items);
			});
		},
		[ type ]
	);
	return (
		<div>
			<h1>Discover</h1>
			<ul>
				{props.user.myTopTracks.map((track, index) => {
					return <li key={index}>{track.name}</li>;
				})}
			</ul>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};
export default connect(mapStateToProps, { setMyTopTracks })(Discover);
