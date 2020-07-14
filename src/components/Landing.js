import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { serverUrl, clientUrl, scopes } from '../variables';
import { Plugins } from '@capacitor/core';
import axios from 'axios';

const oauth2Options = {
	authorizationBaseUrl: 'https://accounts.spotify.com/authorize',
	accessTokenEndpoint: 'https://accounts.spotify.com/api/token',
	scope: scopes,
	web: {
		appId: '549a4d6816834a4aa17ed83775760755',
		responseType: 'code',
		redirectUrl: clientUrl,
		windowOptions: 'height=600,left=0,top=0'
	},
	android: {
		appId: '549a4d6816834a4aa17ed83775760755',
		responseType: 'code', // if you configured a android app in google dev console the value must be "code"
		redirectUrl: 'com.example.kym' // package name from google dev console
	}
};

const Landing = (props) => {
	const onLogin = () => {
		// let a = window.open(`${serverUrl}/login`, 'spotify-login', `width=500,height=800,left=400`);
		// Plugins.OAuth2Client
		// 	.authenticate(oauth2Options)
		// 	.then((response) => {
		// 		console.log(response);
		// 		let accessToken = response['access_token'];
		// 		this.refreshToken = response['refresh_token'];
		// 		// only if you include a resourceUrl protected user values are included in the response!
		// 		let oauthUserId = response['id'];
		// 		let name = response['name'];
		// 		// go to backend
		// 	})
		// 	.catch((reason) => {
		// 		console.error('OAuth rejected', reason);
		// 	});
		axios
			.get(`${serverUrl}/login`)
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const renderLoginButton = () => {
		return (
			<div>
				<a href={`${serverUrl}/login`}>Login with Spotify</a>
				<button onClick={onLogin}>Login</button>
			</div>
		);
	};

	return (
		<Fragment>
			<h1>Landing</h1>
			{renderLoginButton()}
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		device: state.auth.device
	};
};

export default connect(mapStateToProps)(Landing);
