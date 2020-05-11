import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setMyPlaylists } from '../actions';
import { addOpenPlaylist } from '../helpers.js';

const Library = (props) => {
	const onAddClick = async (pid, uid, i) => {
		const body = {
			userId: uid,
			playlistId: pid,
			rating: 0
		};
		const response = await addOpenPlaylist(body);
		props.myPlaylists[i].open = true;
	};

	if (props.myPlaylists.length == 0) return <div>Loading</div>;
	return (
		<div>
			<h1>My Playlists</h1>
			<ul>
				{props.myPlaylists.map((playlist, index) => {
					return (
						<li key={index}>
							<span>{playlist.name} </span>

							<button
								onClick={() => {
									onAddClick(playlist.id, playlist.owner.id, index);
								}}
								style={{
									display: `${playlist.public && !playlist.open ? 'in-line' : 'none'}`
								}}
							>
								Add to Open Playlists
							</button>
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
export default connect(mapStateTopProps, { setMyPlaylists })(Library);
