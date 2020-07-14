import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
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
	logoutUser,
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
	isValid_a,
	updateTokens,
	updateTokens_a,
	getMyTopTracks,
	getUserPlaylists,
	getOpenPlaylists,
	found,
	getRegisteredUsers,
	getStorage,
	getDeviceInfo
} from './helpers';
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
import { Plugins } from '@capacitor/core';

const refresh = () => {
	let d = new Date();
	setTimeout(async () => {
		const res = await axios.get(`${serverUrl}/refresh_token?refresh_token=${localStorage.refresh_token}`);
		console.log(res);
		updateTokens(res.data);
		refresh();
	}, parseInt(localStorage.token_expire_time - d.getTime()));
};

const refresh_a = (refresh_token) => {
	let d = new Date();

	getStorage('token_expire_time').then((time) => {
		setTimeout(async () => {
			const res = await axios.get(`${serverUrl}/refresh_token?refresh_token=${refresh_token}`);
			console.log(res);
			updateTokens_a(res.data);
			refresh_a(refresh_token);
		}, parseInt(time) - parseInt(d.getTime()));
	});
};

const App = (props) => {
	const [ params, setParams ] = useState();

	Plugins.App.addListener('appUrlOpen', (data) => {
		props.setUserLoading();
		console.log(JSON.stringify(data));
		const hash = data.url.split('#')[1];
		console.log('checking for native params');
		const pars = getParams('#' + hash);
		console.log('setting native params');
		setParams(pars);
		console.log('params found');
		console.log('updating tokens');
		updateTokens_a(pars).then((data) => {
			if (data === 'successful') {
				console.log('getting refresh token');
				getStorage('refresh_token').then((refresh_token) => {
					console.log('refresh token found');
					refresh_a(refresh_token);
					getStorage('access_token').then((access_token) => {
						console.log(access_token);
						setAccessToken(access_token);
						setMe().then((data) => {
							console.log('setting me');
							props.loginUser(data);
							props.setUserNotLoading();
						});
					});
				});
			}
		});
	});
	useEffect(() => {
		console.log('getting device info');
		getDeviceInfo().then((device) => {
			props.setDevice(device.platform);
		});
	}, []);

	useEffect(
		() => {
			if (props.auth.device === 'web') {
				console.log('on web');
				if (window.location.hash) {
					const pars = getParams(window.location.hash);
					updateTokens(pars);
					refresh();
					setAccessToken(pars.access_token);
					setMe().then((data) => {
						console.log('setting me');
						props.loginUser(data);
						props.setUserNotLoading();
					});
				} else {
					if (localStorage.access_token) {
						if (isValid()) {
							setAccessToken(localStorage.access_token);
							setMe().then((data) => {
								console.log('setting me');
								props.loginUser(data);
								props.setUserNotLoading();
							});
						} else {
							console.log('not valid');
							refresh();
							setAccessToken(localStorage.access_token);
							setMe().then((data) => {
								console.log('setting me');
								props.loginUser(data);
								props.setUserNotLoading();
							});
						}
					} else {
						props.setUserNotLoading();
					}
				}
			} else if (props.auth.device === 'android' || props.auth.device === 'ios') {
				console.log('Register custom capacitor plugins');
				console.log('on ' + props.auth.device);
				if (isEmpty(params)) {
					console.log('empty params');
					console.log('checking for acc token in storage');
					getStorage('access_token').then((foundToken) => {
						if (foundToken) {
							console.log('token found');
							isValid_a().then((isvalid) => {
								if (isvalid) {
									console.log('is valid');
									setAccessToken(foundToken);
									setMe().then((data) => {
										console.log('setting me');
										props.loginUser(data);
										props.setUserNotLoading();
									});
								} else {
									console.log('is not valid');
									// refresh the token
									console.log('getting refresh token');

									getStorage('refresh_token').then((refresh_token) => {
										refresh_a(refresh_token);
										getStorage('access_token').then((access_token) => {
											setAccessToken(access_token);
											setMe().then((data) => {
												console.log('setting me');
												props.loginUser(data);
												props.setUserNotLoading();
											});
										});
									});
								}
							});
						} else {
							console.log('token not found');
							props.setUserNotLoading();
						}
					});
				}
			}
		},
		[ props.auth.device ]
	);
	useEffect(
		() => {
			console.log('checking is authenticated');
			if (props.auth.isAuthenticated) {
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
						return;
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

	if (props.auth.isAuthenticated) {
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
		if (props.auth.loading)
			return (
				<IonApp>
					<div>Loading</div>
				</IonApp>
			);
		else
			return (
				<IonApp>
					<Landing />
					{/* <IonReactRouter>
						<IonRouterOutlet>
							<Route path="/" component={Landing} />
						</IonRouterOutlet>
					</IonReactRouter> */}
				</IonApp>
			);
	}
};
const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user,
	topTracks: state.user.myTopTracks
});
export default connect(mapStateToProps, {
	loginUser,
	setUserLoading,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists,
	setRegisteredUsers,
	setDevice,
	logoutUser
})(App);
