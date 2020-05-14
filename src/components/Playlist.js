import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addToMyPlaylists, removeFromMyPlaylists } from '../actions';
import isEmpty from 'is-empty';
import {
	getPlaylist,
	getOpenPlaylist,
	addRating,
	areFollowingPlaylist,
	followPlaylist,
	unfollowPlaylist
} from '../helpers';

const Playlist = (props) => {
	const [ playlist, setPlaylist ] = useState({});
	const [ isOpen, setIsOpen ] = useState(false);
	const [ rated, setRated ] = useState(false);
	const [ follow, setFollow ] = useState(null);
	const [ openPlaylist, setOpenPlaylist ] = useState({});
	useEffect(
		() => {
			getPlaylist(props.match.params.pid).then((data) => {
				setPlaylist(data);
				areFollowingPlaylist(data.id, [ props.auth.user.id ]).then((res) => {
					if (res[0]) {
						setFollow(true);
					} else {
						setFollow(false);
					}
				});
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

	const onFollowClick = () => {
		if (follow) {
			unfollowPlaylist(playlist.id);
			const index = props.myPlaylists.findIndex(({ id }) => id === playlist.id);
			props.removeFromMyPlaylists(index);
		} else {
			followPlaylist(playlist.id);
			props.addToMyPlaylists(playlist);
		}
	};

	const renderFollowButton = () => {
		if (follow === null) return null;
		if (!follow) {
			return <button onClick={onFollowClick}>Follow</button>;
		} else {
			return <button onClick={onFollowClick}>Unfollow</button>;
		}
	};

	if (isEmpty(playlist)) return <div>Loading</div>;
	return (
		<div>
			<h1>
				{playlist.name}
				<span> {renderFollowButton()}</span>
			</h1>
			<h3>Tracks</h3>
			<ul>{renderTracks()}</ul>
			{isOpen ? <h2>Rating : {openPlaylist.overallRating}</h2> : null}
			{isOpen ? renderRatingOption() : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth,
		myPlaylists: state.user.myPlaylists
	};
};
export default connect(mapStateToProps, { addToMyPlaylists, removeFromMyPlaylists })(Playlist);
