import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
	loginUser,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists,
	setRegisteredUsers
} from './actions';
import history from './history';
import { connect } from 'react-redux';
import Header from './layouts/Header';
import Home from './components/Home';
import Discover from './components/Discover';
import Library from './components/Library';
import About from './components/About';
import Search from './components/Search';
import Toolbar from './components/Toolbar';
import Landing from './components/Landing';
import AppUrlListener from './components/AppUrlListener';
import Playlist from './components/Playlist';
import isEmpty from 'is-empty';
import {
	setAccessToken,
	setMe,
	getParams,
	isValid,
	calculateTimeLeft,
	updateTokens,
	getMyTopTracks,
	getUserPlaylists,
	getOpenPlaylists,
	found,
	compareValues,
	getRegisteredUsers,
	getStorage,
	getDeviceInfo
} from './helpers/index.js';
import './assets/stylesheets/App.css';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// importing bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { SpotifyAuth } from '@ionic-native/spotify-auth';
import { config } from './creds';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;
const App = (props) => {
	const [ timeLeft, setTimeLeft ] = useState(10);
	const [ myself, setMyself ] = useState(false);
	const [ token, setToken ] = useState(null);

	useEffect(
		() => {
			if (props.auth.isAuthenticated) {
				getMyTopTracks(props.auth.user.id).then((data) => {
					props.setMyTopTracks(data);
				});
				getUserPlaylists(props.user.id).then((data) => {
					getOpenPlaylists().then((res) => {
						data.map((playlist) => {
							if (found(res.data, playlist.id)) {
								playlist.open = true;
							} else {
								playlist.open = false;
							}
						});
						res.data.sort((a, b) => {
							if (a.overallRating > b.overallRating) return -1;
							return 1;
						});
						props.setMyPlaylists(data);
						props.setOpenPlaylists(res.data);
					});
				});
				getRegisteredUsers().then((res) => {
					props.setRegisteredUsers(res.data);
				});
			}
		},
		[ props.auth.isAuthenticated ]
	);

	useEffect(
		() => {
			getDeviceInfo().then((device) => {
				getStorage('accessToken').then(async (foundToken) => {
					if (device.platform === 'web') {
						const params = getParams();
						console.log('got the token');
						if (isEmpty(params)) {
							console.log('empty');
							if (foundToken) {
								console.log('token exists');
								// check if token is valid and also check if user stills exists in db
								isValid().then((isvalid) => {
									if (isvalid) {
										console.log('is valid');
										setToken(foundToken);
										setTimeout(() => {
											calculateTimeLeft().then((data) => {
												setTimeLeft(data);
											});
										}, 1000);
									} else {
										console.log('is not valid');
										// refresh the token
										getStorage('refreshToken').then((refreshToken) => {
											console.log(refreshToken);
											window.open(
												`http://localhost:3005/refresh_token?refresh_token=${refreshToken}`
											);
										});
										setTimeout(() => {
											calculateTimeLeft().then((data) => {
												console.log(data);
												setTimeLeft(data);
											});
										}, 1000);
									}
								});
							} else {
								console.log("token doesn't exist");
								props.setUserNotLoading();
							}
						} else {
							console.log('not empty');
							// returned from server
							updateTokens(params).then((data) => {
								setToken(data);
								setTimeLeft(timeLeft + 1);
							});
						}
					}
					if (device.platform === 'android' || device.platform === 'ios') {
						if (!foundToken) {
							const res = await SpotifyAuth.authorize(config);
							await Toast.show(res);
							// console.log(`Got an access token, its ${accessToken}!`);
							// console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
							// setToken(accessToken);
						} else {
							isValid().then(async (isvalid) => {
								if (isvalid) {
									setToken(foundToken);
								} else {
									const res = awaitSpotifyAuth.authorize(config);
									await Toast.show(res);
									// console.log(`Got an access token, its ${accessToken}!`);
									// console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
									// setToken(accessToken);
								}
							});
						}
					}
				});
			});
		},
		[ timeLeft, token ]
	);

	useEffect(
		() => {
			if (token) {
				setAccessToken(token);
				setMe().then((data) => {
					props.loginUser(data);
					props.setUserNotLoading();
				});
				setMyself(true);
			}
		},
		[ myself, token ]
	);

	if (props.auth.isAuthenticated) {
		return (
			<IonApp>
				{/* <IonReactRouter>
					<IonRouterOutlet> */}
				<BrowserRouter>
					<AppUrlListener />
					<Header />
					<Switch>
						<Route exact path="/library" component={Library} />
						<Route exact path="/about" component={About} />
						<Route exact path="/search" component={Search} />
						<Route exact path="/discover" component={Discover} />
						<Route path="/" component={Home} />
					</Switch>
					<Toolbar />
				</BrowserRouter>
				{/* </IonRouterOutlet>
				</IonReactRouter> */}
			</IonApp>
		);
	} else {
		if (props.auth.loading)
			return (
				<IonApp>
					<div>Loading</div>
				</IonApp>
			);
		else
			return (
				<IonApp>
					<IonReactRouter>
						<IonRouterOutlet>
							<Route path="/" component={Landing} />
						</IonRouterOutlet>
					</IonReactRouter>
				</IonApp>
			);
	}
};
const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user
});
export default connect(mapStateToProps, {
	loginUser,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists,
	setRegisteredUsers
})(App);
