import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { loginUser, setUserNotLoading, setMyTopTracks, setMyPlaylists, setOpenPlaylists } from './actions';
import history from './history';
import { connect } from 'react-redux';
import Header from './layouts/Header';
import Home from './components/Home';
import Discover from './components/Discover';
import Profile from './components/Profile';
import Library from './components/Library';
import About from './components/About';
import Search from './components/Search';
import Toolbar from './components/Toolbar';
import Landing from './components/Landing';
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
	found
} from './helpers.js';

const App = (props) => {
	const [ timeLeft, setTimeLeft ] = useState(calculateTimeLeft());

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
						props.setMyPlaylists(data);
						props.setOpenPlaylists(res.data);
					});
				});
			}
		},
		[ props.auth.isAuthenticated ]
	);

	useEffect(
		() => {
			const params = getParams();
			let token = '';
			if (isEmpty(params)) {
				if (localStorage.accessToken) {
					// check if token is valid and also check if user stills exists in db
					if (isValid()) {
						token = localStorage.accessToken;
						setTimeout(() => {
							setTimeLeft(calculateTimeLeft());
						}, 1000);
					} else {
						// refresh the token
						window.open(`http://localhost:3005/refresh_token?refresh_token=${localStorage.refreshToken}`);
						setTimeout(() => {
							setTimeLeft(calculateTimeLeft());
						}, 1000);
						token = localStorage.accessToken;
					}
				} else {
					props.setUserNotLoading();
				}
			} else {
				// returned from server
				updateTokens(params);
				token = params.accessToken;
			}

			if (token !== '') {
				setAccessToken(token);
				setMe().then((data) => {
					props.loginUser(data);
					props.setUserNotLoading();
				});
			}
		},
		[ timeLeft, localStorage.accessToken ]
	);

	if (props.auth.isAuthenticated) {
		return (
			<BrowserRouter history={history}>
				<Header />
				<Route path="/profile" component={Profile} />
				<Route path="/library" component={Library} />
				<Route path="/about" component={About} />
				<Route path="/search" component={Search} />
				<Route path="/discover" component={Discover} />
				<Route exact path="/" component={Home} />
				<Toolbar />
			</BrowserRouter>
		);
	} else {
		if (props.auth.loading) return <div>Loading</div>;
		else return <Landing />;
	}
};
const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user,
	errors: state.errors
});
export default connect(mapStateToProps, {
	loginUser,
	setUserNotLoading,
	setMyTopTracks,
	setMyPlaylists,
	setOpenPlaylists
})(App);
