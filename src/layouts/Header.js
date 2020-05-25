import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { logoutUser, setMyTopTracks } from '../actions';
import default_avatar from '../assets/images/default_avatar.jpg';

const Header = (props) => {
	useEffect(() => {}, []);
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
		</div>
	);
};

const mapStateTopProps = (state) => {
	return {
		user: state.auth.user
	};
};
export default connect(mapStateTopProps, { logoutUser, setMyTopTracks })(Header);
