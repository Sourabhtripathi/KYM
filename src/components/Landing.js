import React from 'react';
import { connect } from 'react-redux';
import { IonContent } from '@ionic/react';
import { serverUrl } from '../variables';
import { authorize } from '../helpers';

const Landing = (props) => {
	const onAuthClick = () => {
		// authorize().then()
		console.log('clicked');
	};

	const renderLoginButton = () => {
		// if (props.device === 'web') {
		return <a href={`${serverUrl}/login`}>Login with Spotify</a>;
		// } else {
		// return <button onClick={onAuthClick}>Native Auth</button>;
		// }
	};

	return (
		<IonContent>
			<h1>Landing</h1>
			{renderLoginButton()}
		</IonContent>
	);
};

const mapStateToProps = (state) => {
	return {
		device: state.auth.device
	};
};

export default connect(mapStateToProps)(Landing);
