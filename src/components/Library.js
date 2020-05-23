import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setMyPlaylists, addToOpenPlaylists, removeFromOpenPlaylists, togglePlaylist } from '../actions';
import { addOpenPlaylist, removeOpenPlaylist } from '../helpers/index.js';

const Library = (props) => {
	const onAddClick = async (pid, pname, uid, images, i) => {
		const body = {
			userId: uid,
			playlistId: pid,
			playlistName: pname,
			overallRating: 0,
			totalRating: 0,
			ratedBy: [],
			images: [ ...images ]
		};
		await addOpenPlaylist(body);
		const payload = {
			index: i,
			val: true
		};
		props.togglePlaylist(payload);
		props.addToOpenPlaylists(body);
	};

	const onRemoveClick = async (pid, i) => {
		await removeOpenPlaylist(pid);
		const payload = {
			index: i,
			val: false
		};
		props.togglePlaylist(payload);
		props.removeFromOpenPlaylists(i);
	};

	const renderButton = (index) => {
		if (!props.myPlaylists[index].open && props.myPlaylists[index].public) {
			return (
				<button
					onClick={() => {
						onAddClick(
							props.myPlaylists[index].id,
							props.myPlaylists[index].name,
							props.myPlaylists[index].owner.id,
							props.myPlaylists[index].images,
							index
						);
					}}
				>
					Add to Open Playlists
				</button>
			);
		} else if (props.myPlaylists[index].open) {
			return (
				<button
					onClick={() => {
						onRemoveClick(props.myPlaylists[index].id, index);
					}}
				>
					Remove from Open Playlists
				</button>
			);
		} else {
			return null;
		}
	};

	return (
		<div>
			<h1>My Playlists</h1>
			<ul>
				{props.myPlaylists.map((playlist, index) => {
					return (
						<li key={index}>
							<span>
								<Link to={`/playlist/${playlist.id}`}>{playlist.name} </Link>
							</span>
							{playlist.owner.id === props.user.id ? renderButton(index) : null}
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
export default connect(mapStateTopProps, {
	setMyPlaylists,
	addToOpenPlaylists,
	removeFromOpenPlaylists,
	togglePlaylist
})(Library);
