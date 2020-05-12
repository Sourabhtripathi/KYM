import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Discover = (props) => {
	const [ type, setType ] = useState('playlists');
	const [ openPlaylists, setOpenPlaylists ] = useState([]);

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

	const renderOpenPlaylists = () => {
		return props.user.openPlaylists.map((playlist, index) => {
			return (
				<li key={index}>
					<Link to={`/playlist/${playlist.playlistId}`}>{playlist.playlistName}</Link>
				</li>
			);
		});
	};

	const renderSimilarUsers = () => {
		return props.user.similarUsers.map((user, index) => {
			return (
				<li key={index}>
					<Link to={`/`}>{user.name}</Link>
				</li>
			);
		});
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
			<h3>Top {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
			<ul>{type === 'playlists' ? renderOpenPlaylists() : renderSimilarUsers()}</ul>
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
