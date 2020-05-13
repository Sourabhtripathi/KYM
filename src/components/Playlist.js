import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'is-empty';
import { getPlaylist, getOpenPlaylist, addRating } from '../helpers';

const Playlist = (props) => {
	const [ playlist, setPlaylist ] = useState({});
	const [ isOpen, setIsOpen ] = useState(false);
	const [ rated, setRated ] = useState(false);
	const [ openPlaylist, setOpenPlaylist ] = useState({});
	useEffect(
		() => {
			getPlaylist(props.match.params.pid).then((data) => {
				setPlaylist(data);
			});

			getOpenPlaylist(props.match.params.pid).then((res) => {
				if (!isEmpty(res.data)) {
					setIsOpen(true);
					setOpenPlaylist(res.data[0]);
					if (checkRated()) {
						setRated(true);
					} else {
						setRated(false);
					}
				}
			});
		},
		[ playlist ]
	);

	const checkRated = () => {
		for (const i in openPlaylist.ratedBy) {
			if (openPlaylist.ratedBy[i] === props.auth.user.id) {
				return true;
			}
		}
		return false;
	};

	const renderTracks = () => {
		return playlist.tracks.items.map((track, index) => {
			return <li key={index}>{track.track.name}</li>;
		});
	};

	const onRatingSubmit = async (e) => {
		e.preventDefault();
		console.log(e.currentTarget.rating.value);
		console.log(props.auth.user);
		const response = await addRating(openPlaylist.playlistId, props.auth.user.id, e.currentTarget.rating.value);
		console.log(response);
	};

	const renderRatingOption = () => {
		if (props.auth.user.id !== playlist.owner.id && !rated) {
			return (
				<form onSubmit={onRatingSubmit}>
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

	if (isEmpty(playlist)) return <div>Loading</div>;
	return (
		<div>
			<h1>{playlist.name}</h1>
			<h3>Tracks</h3>
			<ul>{renderTracks()}</ul>
			{isOpen ? <h2>Rating : {openPlaylist.overallRating}</h2> : null}
			{isOpen ? renderRatingOption() : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	};
};
export default connect(mapStateToProps)(Playlist);
