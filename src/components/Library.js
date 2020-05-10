import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setMyPlaylists } from '../actions';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Library = (props) => {
	useEffect(
		() => {
			spotifyApi.getUserPlaylists(props.user.id).then((res) => {
				props.setMyPlaylists(res.items);
			});
		},
		[ props.myPlaylists ]
	);
	if (props.myPlaylists.length == 0) return <div>Loading</div>;
	return (
		<div>
			<h1>My Playlists</h1>
			<ul>
				{props.myPlaylists.map((playlist, index) => {
					return (
						<li key={index}>
							<span>{playlist.name} </span>
							{/* <button style={{display : {playlist.}}}>Add to Open Playlists</button> */}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

const mapStateTopProps = (state) => {
	return {
		user: state.auth.user,
		myPlaylists: state.user.myPlaylists
	};
};
export default connect(mapStateTopProps, { setMyPlaylists })(Library);
