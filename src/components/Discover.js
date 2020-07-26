import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addRating, onPlaylistClick, onUserClick } from '../helpers';
import { addToRatedBy } from '../actions';
import '../assets/stylesheets/Discover.css';
import Wrapper from './Wrapper';
import CardList from './CardList';

const Discover = (props) => {
	const [ type, setType ] = useState('playlists');

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
			if (playlist.userId !== props.auth.user.id) {
				return (
					<li key={index}>
						<div>
							<header>
								<span className="playlist" onClick={() => onPlaylistClick(playlist.playlistId)}>
									{playlist.playlistName}{' '}
								</span>
							</header>

							<img
								alt="playlist"
								src={playlist.images[0].url}
								style={{ height: '100px', width: '100px' }}
							/>
							<div>
								<span>
									<span className="user" onClick={() => onUserClick(playlist.userId)}>
										{playlist.userName}
									</span>{' '}
									::{' '}
								</span>
								<span>Rating : {playlist.overallRating}</span>
								{renderRatingOption(playlist.playlistId, playlist.userId, playlist.ratedBy, index)}
							</div>
						</div>
					</li>
				);
			} else {
				return null;
			}
		});
	};

	return (
		<Fragment>
			<h3>Top {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
			<CardList data={type === 'playlists' ? props.user.openPlaylists : null} />
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
		auth: state.auth
	};
};

const conf = {
	title: 'Discover'
};

export default Wrapper(connect(mapStateToProps, { addToRatedBy })(Discover), conf);
