import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
	loginUser,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists,
	setRegisteredUsers,
	setDevice
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

const App = (props) => {
	const [ timeLeft, setTimeLeft ] = useState(10);
	const [ myself, setMyself ] = useState(false);
	const [ token, setToken ] = useState(null);

	useEffect(
		() => {
			getDeviceInfo().then((device) => {
				props.setDevice(device.platform);
			});
		},
		[ props.auth.device ]
	);

	useEffect(
		() => {
			if (props.auth.isAuthenticated) {
				console.log('is authenticated');
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
			if (props.auth.device === 'web') {
				getStorage('access_token').then((foundToken) => {
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
									getStorage('refresh_token').then((refresh_token) => {
										console.log(refresh_token);
										window.open(
											`http://localhost:3005/refresh_token?refresh_token=${refresh_token}`
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
				});
			}

			if (props.auth.device === 'android' || props.auth.device === 'ios') {
				console.log({ text: 'in android' });
				props.setUserNotLoading();

				// 	if (!foundToken) {

				// 		// console.log(`Got an access token, its ${accessToken}!`);
				// 		// console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
				// 		// setToken(accessToken);
				// 	} else {
				// 		isValid().then((isvalid) => {
				// 			if (isvalid) {
				// 				setToken(foundToken);
				// 			} else {
				// 				SpotifyAuth.authorize(config).then((data) => {
				// 					console.log({ text: 'authorized' });
				// 					console.log(data);
				// 					// console.log(`Got an access token, its ${accessToken}!`);
				// 					// console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
				// 				});
				// 				// console.log(`Got an access token, its ${accessToken}!`);
				// 				// console.log(`Its going to expire in ${expiresAt - Date.now()}ms.`);
				// 				// setToken(accessToken);
				// 			}
				// 		});
				// 	}
			}
		},
		[ props.auth.device, timeLeft, token ]
	);

	useEffect(
		() => {
			if (token) {
				setAccessToken(token);
				setMe().then((data) => {
					console.log('setting me');
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
	setRegisteredUsers,
	setDevice
})(App);
