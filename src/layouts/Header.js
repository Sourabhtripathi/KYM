import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { logoutUser, setMyTopTracks } from '../actions';
import default_avatar from '../assets/images/default_avatar.jpg';

const Header = (props) => {
	useEffect(
		() => {
			console.log(props.topTracks);
		},
		[ props.topTracks ]
	);
	const onLogoutClick = () => {
		props.logoutUser();
		props.setMyTopTracks([]);
	};
	return (
		<div>
			<h4>Signed in as {props.user.display_name}</h4>
			<img
				src={props.user.images.length > 0 ? props.user.images[0].url : default_avatar}
				style={{ height: '40px', width: '40px' }}
			/>
			<button onClick={onLogoutClick}>Logout</button>
			<img
				src={
					props.topTracks.length > 0 ? (
						props.topTracks.items.images[0].url
					) : (
						'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRfAVBMxcqigV9t3Dae3WF1n7DJtkw60fkB9zvarNuo0GpKPcl6&usqp=CAU'
					)
				}
			/>
		</div>
	);
};

const mapStateTopProps = (state) => {
	return {
		user: state.auth.user,
		topTracks: state.user.myTopTracks
	};
};
export default connect(mapStateTopProps, { logoutUser, setMyTopTracks })(Header);
