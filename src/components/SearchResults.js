import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { search } from '../helpers';

const SearchResults = ({ query, openPlaylists, registeredUsers }) => {
	const [ playlistContent, setPlaylistContent ] = useState([]);
	const [ userContent, setUserContent ] = useState([]);
	useEffect(
		() => {
			// Playlists
			let keys = [ 'playlistName' ];
			let options = {
				caseSensitive: false,
				sort: true
			};
			let result = search(openPlaylists, keys, query, options);
			setPlaylistContent(result);
			keys = [ 'name' ];
			result = search(registeredUsers, keys, query, options);
			setUserContent(result);
			console.log(playlistContent);
			console.log(userContent);
		},
		[ query ]
	);

	const renderPlaylistResults = () => {
		if (playlistContent.length === 0) {
			return (
				<div>
					<h2>No Playlist found</h2>
				</div>
			);
		} else {
			return (
				<div>
					<h1>Playlists</h1>
					{playlistContent.map((res, index) => {
						return <li key={index}>{res.playlistName}</li>;
					})}
				</div>
			);
		}
	};

	const renderUserResults = () => {
		if (userContent.length === 0) {
			return (
				<div>
					<h2>No User found</h2>
				</div>
			);
		} else {
			return (
				<div>
					<h1>Users</h1>
					{userContent.map((res, index) => {
						return <li key={index}>{res.name}</li>;
					})}
				</div>
			);
		}
	};

	if (query === '') {
		return (
			<div>
				<h2>Search for a playlist or a user</h2>
			</div>
		);
	} else {
		return (
			<div>
				{renderPlaylistResults()}
				{renderUserResults()}
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		openPlaylists: state.user.openPlaylists,
		registeredUsers: state.db.registeredUsers
	};
};

export default connect(mapStateToProps)(SearchResults);
