import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { loginUser, setUserNotLoading } from './actions';
import history from './history';
import { connect } from 'react-redux';
import Home from './components/Home';
import Discover from './components/Discover';
import Profile from './components/Profile';
import Library from './components/Library';
import About from './components/About';
import Search from './components/Search';
import Toolbar from './components/Toolbar';
import Landing from './components/Landing';
import isEmpty from 'is-empty';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

// const spotifyWebApi = new Spotify();

const App = (props) => {
	let token = '';
	useEffect(() => {
		const params = getParams();
		console.log(params);
		console.log('useEffect');
		if (isEmpty(params)) {
			console.log('empty');
			if (localStorage.jwtToken) {
				// check if token is valid and also check if user stills exists in db

				// if (valid && userExists) {
				// 	token = localStorage.jwtToken;
				// } else {
				// 	localStorage.removeItem('jwtToken');
				// 	props.setUserNotLoading();
				// }
				console.log('token found' + localStorage.jwtToken);
			} else {
				console.log('token not found');
				props.setUserNotLoading();
			}
		} else {
			console.log('not empty');
			// returned from server
			token = params.token;
			localStorage.setItem('jwtToken', token);
		}

		if (token !== '') {
			spotifyApi.setAccessToken(token);
			setMe();
		}
	}, props.auth.isAuthenticated);

	const getParams = () => {
		const str = window.location.hash.substring(1);
		let pieces = str.split('&'),
			data = {},
			i,
			parts;
		// process each query pair
		for (i = 0; i < pieces.length; i++) {
			parts = pieces[i].split('=');
			if (parts.length < 2) {
				parts.push('');
			}
			data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
		}
		return JSON.parse(Object.keys(data)[0]);
	};

	const setMe = () => {
		spotifyApi.getMe().then((response) => {
			props.loginUser(response.id);
			props.setUserNotLoading();
		});
	};

	if (props.auth.isAuthenticated) {
		return (
			<BrowserRouter history={history}>
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
	errors: state.errors
});
export default connect(mapStateToProps, { loginUser, setUserNotLoading })(App);
