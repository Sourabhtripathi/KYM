import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

const Playlist = (props) => {
	const [ tracks, setTracks ] = useState([]);
	useEffect(
		() => {
			spotifyApi.getPlaylist(props.match.params.pid).then((data) => {
				setTracks(data.tracks.items);
			});
		},
		[ tracks ]
	);

	const renderTracks = () => {
		return tracks.map((track, index) => {
			return <li key={index}>{track.track.name}</li>;
		});
	};
	if (tracks.length == 0) return <div>Loading</div>;
	return (
		<div>
			<h3>Tracks</h3>
			<ul>{renderTracks()}</ul>
		</div>
	);
};

export default Playlist;
