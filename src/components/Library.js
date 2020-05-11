import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setMyPlaylists, addToOpenPlaylists, removeFromOpenPlaylists } from '../actions';
import { addOpenPlaylist, removeOpenPlaylist } from '../helpers.js';

const Library = (props) => {
	const onAddClick = async (pid, uid, i) => {
		const body = {
			userId: uid,
			playlistId: pid,
			rating: 0
		};
		const response = await addOpenPlaylist(body);
		props.myPlaylists[i].open = true;
		props.addToOpenPlaylists(body);
	};

	const onRemoveClick = async (pid, i) => {
		const response = await removeOpenPlaylist(pid);
		props.myPlaylists[i].open = false;
		props.removeFromOpenPlaylists(i);
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

							<button
								onClick={() => {
									onRemoveClick(playlist.id, index);
								}}
								style={{
									display: `${playlist.open ? 'in-line' : 'none'}`
								}}
							>
								Remove from Open Playlists
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
export default connect(mapStateTopProps, { setMyPlaylists, addToOpenPlaylists, removeFromOpenPlaylists })(Library);
