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
	getRegisteredUsers
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
	const [ timeLeft, setTimeLeft ] = useState(calculateTimeLeft());
	const [ myself, setMyself ] = useState(false);

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
			const params = getParams();
			if (isEmpty(params)) {
				if (localStorage.accessToken) {
					// check if token is valid and also check if user stills exists in db
					if (isValid()) {
						setTimeout(() => {
							setTimeLeft(calculateTimeLeft());
						}, 1000);
					} else {
						// refresh the token
						window.open(`http://localhost:3005/refresh_token?refresh_token=${localStorage.refreshToken}`);
						setTimeout(() => {
							setTimeLeft(calculateTimeLeft());
						}, 1000);
					}
				} else {
					props.setUserNotLoading();
				}
			} else {
				// returned from server
				updateTokens(params);
			}
		},
		[ timeLeft ]
	);

	useEffect(
		() => {
			setAccessToken(localStorage.accessToken);
			setMe().then((data) => {
				props.loginUser(data);
				props.setUserNotLoading();
			});
			setMyself(true);
		},
		[ myself, localStorage.accessToken ]
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
