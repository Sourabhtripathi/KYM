import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { search } from '../helpers';
const SearchResults = ({ query, openPlaylists }) => {
	const [ playlistContent, setPlaylistContent ] = useState([]);
	const [ userContent, setUserContent ] = useState([]);
	useEffect(
		() => {
			// Playlists
			const keys = [ 'userName', 'playlistName' ];
			const options = {
				caseSensitive: false,
				sort: true
			};
			const result = search(openPlaylists, keys, query, options);
			setPlaylistContent(result);
		},
		[ query ]
	);

	const renderPlaylistResults = () => {
		if (playlistContent.length > 0)
			return (
				<div>
					<h1>Playlists</h1>
					{playlistContent.map((res, index) => {
						return <li key={index}>{res.playlistName}</li>;
					})}
				</div>
			);
	};

	const renderUserResults = () => {
		if (userContent.length > 0)
			return (
				<div>
					<h1>Users</h1>
					{userContent.map((res, index) => {
						return <li key={index}>{res.userName}</li>;
					})}
				</div>
			);
	};

	if (query === '') {
		return (
			<div>
				<h2>Search Something</h2>
			</div>
		);
	} else {
		if (playlistContent.length === 0 && userContent.length === 0) {
			return (
				<div>
					<h2>No Results</h2>
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
	}
};

const mapStateToProps = (state) => {
	return {
		openPlaylists: state.user.openPlaylists
	};
};

export default connect(mapStateToProps)(SearchResults);
