import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import {
	loginUser,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists,
	setRegisteredUsers,
	setDevice,
	setUserLoading
} from './actions';
import { connect } from 'react-redux';
import Header from './layouts/Header';
import Discover from './components/Discover';
import Library from './components/Library';
import About from './components/About';
import Search from './components/Search';
import Landing from './components/Landing';
import isEmpty from 'is-empty';
import {
	setAccessToken,
	setMe,
	getParams,
	isValid,
	updateTokens,
	getMyTopTracks,
	getUserPlaylists,
	getOpenPlaylists,
	found,
	getRegisteredUsers,
	getStorage,
	getDeviceInfo
} from './helpers/index.js';
import './assets/stylesheets/App.css';
import { IonApp, IonRouterOutlet, IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { serverUrl } from './variables';

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
import { Plugins, AppState, registerWebPlugin } from '@capacitor/core';
import { OAuth2Client } from '@byteowls/capacitor-oauth2';

const App = (props) => {
	const [ myself, setMyself ] = useState(false);
	const [ token, setToken ] = useState(null);
	const [ time, setTime ] = useState(0);
	const [ params, setParams ] = useState(null);

	registerWebPlugin(OAuth2Client);

	Plugins.App.addListener('appUrlOpen', (data) => {
		props.setUserLoading();
		const hash = data.url.split('#')[1];
		console.log('checking for native params');
		const par = getParams('#' + hash);
		console.log('setting native params');
		setParams(par);
	});

	Plugins.App.addListener('appStateChange', (state) => {
		console.log(JSON.stringify(state));
	});

	Plugins.Browser.addListener('browserPageLoaded', (data) => {
		console.log('Data - browserPageLoaded: ' + JSON.stringify(data));
	});

	useEffect(() => {
		console.log('getting device info');
		getDeviceInfo().then((device) => {
			props.setDevice(device.platform);
		});
	}, []);

	useEffect(
		() => {
			console.log('checking is authenticated');
			if (props.auth.device && props.auth.isAuthenticated) {
				console.log('is authenticated');
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
				getMyTopTracks(props.auth.user.id).then((data) => {
					console.log('setting top tracks');
					props.setMyTopTracks(data);
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
			setTimeout(() => {
				setTime(time + 1);
			}, 1000);

			if (props.auth.device !== null) {
				let paramsChecked = false;
				console.log('checking for web params');
				if (props.auth.device === 'web') {
					console.log('setting web params');
					if (window.location.hash) {
						setParams(getParams(window.location.hash));
						if (params) {
							paramsChecked = true;
						}
					} else {
						paramsChecked = true;
					}
				} else {
					paramsChecked = true;
				}

				if (paramsChecked) {
					if (isEmpty(params)) {
						console.log('empty params');
						console.log('checking for acc token in storage');
						getStorage('access_token').then((foundToken) => {
							if (foundToken) {
								console.log('token found : ' + JSON.stringify(foundToken));
								isValid().then((isvalid) => {
									if (isvalid) {
										console.log('is valid');
										setToken(foundToken);
									} else {
										console.log('is not valid');
										// refresh the token
										console.log('getting refresh token');
										getStorage('refresh_token').then((refresh_token) => {
											console.log('refresh token found. Now getting a new token');
											window.open(`${serverUrl}/refresh_token?refresh_token=${refresh_token}`);
											// window.open();
										});
									}
								});
							} else {
								console.log('token not found');
								props.setUserNotLoading();
							}
						});
					} else {
						console.log('not empty params');
						updateTokens(params).then((data) => {
							setToken(data);
						});
					}
				}
			}
		},
		[ time ]
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

	console.log('app return');
	if (props.auth.isAuthenticated) {
		console.log('authenticated');
		return (
			<IonApp>
				<IonReactRouter>
					<IonRouterOutlet id="main">
						<IonGrid>
							<IonRow>
								<IonCol size-xs="0" size-md="3" size-lg="2">
									<IonContent className="sidebar">
										<Sidebar />
									</IonContent>
								</IonCol>
								<IonCol size-xs="12" size-md="9" size-lg="10">
									<IonContent className="display-content">
										<div className="dc-header">
											<Route path="/" component={Header} />
										</div>
										<div className="dc-list">
											<Route exact path="/discover" exact component={Discover} />
											<Route exact path="/search" exact component={Search} />
											<Route exact path="/library" exact component={Library} />
											<Route exact path="/about" exact component={About} />
										</div>
									</IonContent>
								</IonCol>
								<IonCol size-xs="12" size-md="0">
									<IonContent className="bottom-nav">
										<Route path="/" component={BottomNav} />
									</IonContent>
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonRouterOutlet>
				</IonReactRouter>
			</IonApp>
		);
	} else {
		console.log('not authenticated');
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
	setUserLoading,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists,
	setRegisteredUsers,
	setDevice
})(App);
