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
	compareValues
} from './helpers/index.js';
import './assets/stylesheets/App.css';

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
						console.log(res.data);
						res.data.sort((a, b) => {
							if (a.overallRating > b.overallRating) return -1;
							return 1;
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
				console.log(params);
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
