import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import useForceUpdate from 'use-force-update';
import { connect } from 'react-redux';
import { addRating } from '../helpers';
import { addToRatedBy } from '../actions';

const Discover = (props) => {
	const [ type, setType ] = useState('playlists');
	// const forceUpdate = useForceUpdate();

	useEffect(() => {
		console.log('discover mounted');
	}, []);

	const onTabSwitch = (val) => {
		setType(val);
	};

	const onRatingSubmit = async (pid, index, e) => {
		e.preventDefault();
		const res = await addRating(pid, props.auth.user.id, e.currentTarget.rating.value);
		const data = {
			index: index,
			data: res.data
		};

		props.addToRatedBy(data);
	};

	const isRated = (ratedBy) => {
		for (const i in ratedBy) {
			if (ratedBy[i] === props.auth.user.id) {
				return true;
			}
		}
		return false;
	};

	const onPlaylistClick = (pid) => {
		window.open(`https://open.spotify.com/playlist/${pid}`);
	};

	const renderRatingOption = (pid, uid, ratedBy, index) => {
		if (props.auth.user.id !== uid && !isRated(ratedBy)) {
			return (
				<form onSubmit={(e) => onRatingSubmit(pid, index, e)}>
					<label>
						Give your rating : <input name="rating" type="number" />
					</label>
					<button>Submit</button>
				</form>
			);
		} else {
			return null;
		}
	};

	const renderOpenPlaylists = () => {
		return props.user.openPlaylists.map((playlist, index) => {
			return (
				<li key={index}>
					<h3 onClick={() => onPlaylistClick(playlist.playlistId)}>{playlist.playlistName} </h3>
					<span>Rating : {playlist.overallRating}</span>
					{renderRatingOption(playlist.playlistId, playlist.userId, playlist.ratedBy, index)}
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
export default connect(mapStateToProps, { addToRatedBy })(Discover);
