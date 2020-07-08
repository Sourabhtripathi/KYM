import React from 'react';
import { connect } from 'react-redux';
import { IonContent } from '@ionic/react';
import { serverUrl } from '../variables';
import { Plugins } from '@capacitor/core';
import { SpotifyAuth } from '@ionic-native/spotify-auth';
import { config } from '../creds';

// const oauth2Options = {
// 	authorizationBaseUrl: serverUrl,
// 	accessTokenEndpoint: `${serverUrl}/login`,

// 	android: {
// 		appId: com.example.kym,
// 		responseType: 'code', // if you configured a android app in google dev console the value must be "code"
// 		redirectUrl: 'com.companyname.appname:/' // package name from google dev console
// 	}
// };

const Landing = (props) => {
	const onAuthClick = () => {
		// authorize().then()
		console.log('clicked');
		// Plugins.OAuth2Client
		// 	.authenticate(oauth2Options)
		// 	.then((response) => {
		// 		console.log(response);
		// 	})
		// 	.catch((reason) => {
		// 		console.error('OAuth rejected', reason);
		// 	});
		SpotifyAuth.authorize(config)
			.then((data) => {
				console.log(JSON.stringify(data));
				// console.log(`Got an access token, its ${accessToken}!`);
				// console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
			})
			.catch((err) => {
				console.log(JSON.stringify(err));
			});
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
			<button onClick={onAuthClick}>Register</button>
		</IonContent>
	);
};

const mapStateToProps = (state) => {
	return {
		device: state.auth.device
	};
};

export default connect(mapStateToProps)(Landing);
