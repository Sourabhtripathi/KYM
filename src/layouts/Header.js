import React, { useState, useEffect, Fragment } from 'react';
import { IonAvatar, IonActionSheet } from '@ionic/react';
import { connect } from 'react-redux';
import { logoutUser, setMyTopTracks } from '../actions';
import default_avatar from '../assets/images/default_avatar.jpg';
import '../assets/stylesheets/Header.css';

const Header = (props) => {
	const [ showActionSheet, setShowActionSheet ] = useState(false);

	const onProfileClick = () => {
		setShowActionSheet(true);
	};

	const onLogoutClick = () => {
		console.log('logout clicked');
		props.logoutUser(props.auth.device);
		window.location.reload();
	};
	return (
		<Fragment>
			<IonAvatar className="profile-pic" onClick={onProfileClick}>
				<img src={props.user.images.length > 0 ? props.user.images[0].url : default_avatar} />
			</IonAvatar>
			<IonActionSheet
				isOpen={showActionSheet}
				onDidDismiss={() => setShowActionSheet(false)}
				cssClass="my-custom-class"
				buttons={[
					{
						text: 'Open Profile in Spotify',
						role: 'destructive',
						handler: () => {
							console.log('Open Profile clicked');
						}
					},
					{
						text: 'Logout',
						role: 'destructive',
						handler: () => {
							onLogoutClick();
						}
					},
					{
						text: 'Cancel',
						role: 'cancel',
						handler: () => {
							console.log('Cancel clicked');
						}
					}
				]}
			/>
		</Fragment>
	);
};

const mapStateTopProps = (state) => {
	return {
		user: state.auth.user,
		auth: state.auth,
		topTracks: state.user.myTopTracks
	};
};
export default connect(mapStateTopProps, { logoutUser, setMyTopTracks })(Header);
