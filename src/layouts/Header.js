import React, { useState, Fragment } from 'react';
import { IonAvatar, IonActionSheet, IonPopover, IonList, IonLabel, IonItem, IonIcon } from '@ionic/react';
import { connect } from 'react-redux';
import { logoutUser, setMyTopTracks } from '../actions';
import { onUserClick } from '../helpers';
import default_avatar from '../assets/images/default_avatar.jpg';
import '../assets/stylesheets/Header.css';
import { arrowRedoOutline, logOutOutline } from 'ionicons/icons';

const Header = (props) => {
	const [ showActionSheet, setShowActionSheet ] = useState(false);
	const [ showPopover, setShowPopover ] = useState(false);

	const onProfileClick = () => {
		const { device } = props.auth;
		if (device === 'web') {
			setShowPopover(true);
		} else if (device === 'android') {
			setShowActionSheet(true);
		}
	};

	const openProfile = () => {
		console.log('open profile');
		const { device, user } = props.auth;
		onUserClick(user.id);
		if (device === 'web') {
			setShowPopover(false);
		} else if (device === 'android') {
			setShowActionSheet(false);
		}
	};

	const onLogoutClick = () => {
		console.log('logout clicked');
		props.logoutUser(props.auth.device);
		window.location.reload();
	};

	const onCancel = () => {
		const { device } = props.auth;
		if (device === 'web') {
			setShowPopover(false);
		} else if (device === 'android') {
			setShowActionSheet(false);
		}
	};
	return (
		<Fragment>
			<IonPopover isOpen={showPopover} cssClass="my-custom-class" onDidDismiss={(e) => setShowPopover(false)}>
				<IonList class="popover-list">
					<IonItem className="popover-item" onClick={openProfile}>
						<IonLabel>
							<IonIcon icon={arrowRedoOutline} />
							<span>Open Profile in Spotify</span>
						</IonLabel>
					</IonItem>
					<IonItem className="popover-item" onClick={onLogoutClick}>
						<IonLabel>
							<IonIcon icon={logOutOutline} />
							<span>Logout</span>
						</IonLabel>
					</IonItem>
					<IonItem className="popover-item" color="tertiary" onClick={onCancel}>
						<IonLabel className="cancel">Cancel</IonLabel>
					</IonItem>
				</IonList>
			</IonPopover>
			<IonAvatar className="profile-pic" onClick={onProfileClick}>
				<img alt="profile" src={props.user.images.length > 0 ? props.user.images[0].url : default_avatar} />
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
							openProfile();
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
							onCancel();
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
