import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { setMyPlaylists, addToOpenPlaylists, removeFromOpenPlaylists, togglePlaylist } from '../actions';
import { addOpenPlaylist, removeOpenPlaylist, onPlaylistClick } from '../helpers';

const Library = (props) => {
	const [ owned, setOwned ] = useState(false);
	const [ followed, setFollowed ] = useState(false);

	const renderRating = (index) => {
		if (props.myPlaylists[index].open) {
			return <div>{props.myPlaylists[index].rating}</div>;
		} else {
			return null;
		}
	};
	const onAddClick = async (pid, pname, uid, uname, images, i) => {
		const body = {
			userId: uid,
			userName: uname,
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
		if (!props.myPlaylists[index].open) {
			return (
				<button
					onClick={() => {
						onAddClick(
							props.myPlaylists[index].id,
							props.myPlaylists[index].name,
							props.user.id,
							props.user.display_name,
							props.myPlaylists[index].images,
							index
						);
					}}
				>
					Add to Open Playlists
				</button>
			);
		} else {
			return (
				<button
					onClick={() => {
						onRemoveClick(props.myPlaylists[index].id, index);
					}}
				>
					Remove from Open Playlists
				</button>
			);
		}
	};

	return (
		<Fragment>
			<h1>My Playlists</h1>
			<h3>Owned Playlists</h3>
			<ul>
				{props.myPlaylists.map((playlist, index) => {
					if (playlist.owner.id === props.user.id) {
						if (!owned) setOwned(true);
						return (
							<li key={index}>
								<div>
									<header>
										<span className="playlist" onClick={() => onPlaylistClick(playlist.id)}>
											{playlist.name}{' '}
										</span>
									</header>
									<img
										alt="playlist"
										src={playlist.images[0].url}
										style={{ height: '100px', width: '100px' }}
									/>
									{renderRating(index)}
									{renderButton(index)}
								</div>
							</li>
						);
					} else {
						return null;
					}
				})}
				{!owned ? <div>Nothing here</div> : null}
			</ul>
			<h3>Followed Playlists</h3>
			<ul>
				{props.myPlaylists.map((playlist, index) => {
					if (playlist.owner.id !== props.user.id) {
						if (!followed) setFollowed(true);
						return (
							<li key={index}>
								<div>
									<header>
										<span className="playlist" onClick={() => onPlaylistClick(playlist.id)}>
											{playlist.name}{' '}
										</span>
									</header>
									<img
										alt="playlist"
										src={playlist.images[0].url}
										style={{ height: '100px', width: '100px' }}
									/>
									{renderRating(index)}
								</div>
							</li>
						);
					} else {
						return null;
					}
				})}
				{!followed ? <div>Nothing here</div> : null}
			</ul>
		</Fragment>
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
