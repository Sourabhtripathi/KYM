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
	const [ timeLeft, setTimeLeft ] = useState(calculateTimeLeft());

	useEffect(
		() => {
			const params = getParams();
			console.log('useEffect');
			let token = '';
			if (isEmpty(params)) {
				console.log('empty');
				if (localStorage.accessToken) {
					console.log('token found' + localStorage.accessToken);
					// check if token is valid and also check if user stills exists in db
					if (isValid()) {
						token = localStorage.accessToken;
						setTimeout(() => {
							setTimeLeft(calculateTimeLeft());
							console.log('checked' + timeLeft);
						}, 1000);
					} else {
						// refresh the token
						console.log('session expired');
						window.open(`http://localhost:3005/refresh_token?refresh_token=${localStorage.refreshToken}`);

						setTimeout(() => {
							setTimeLeft(calculateTimeLeft());
						}, 1000);
					}
				} else {
					console.log('token not found');
					props.setUserNotLoading();
				}
			} else {
				// returned from server
				console.log('not empty');
				var d = new Date();
				// d.setSeconds(d.getSeconds() + 10);
				d.setSeconds(d.getSeconds() + params.expires_in);
				if (!params.refreshToken) {
					// refreshed token-- just change access token and time
					localStorage.setItem('accessToken', params.accessToken);
					localStorage.setItem('token_expire_time', d.getTime());
					window.close();
				} else {
					localStorage.setItem('accessToken', params.accessToken);
					localStorage.setItem('refreshToken', params.refreshToken);
					localStorage.setItem('token_expire_time', d.getTime());
				}

				token = params.accessToken;
			}

			if (token !== '') {
				spotifyApi.setAccessToken(token);
				setMe();
			}
		},
		[ props.auth.isAuthenticated, timeLeft ]
	);

	const getParams = () => {
		if (isEmpty(window.location.hash)) {
			return {};
		}
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
		console.log(timeLeft);
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

const isValid = () => {
	const d = new Date();
	if (d.getTime() <= parseInt(localStorage.token_expire_time)) return true;
	return false;
};

const calculateTimeLeft = () => {
	let timeLeft = 10;
	if (localStorage.accessToken) {
		const difference = localStorage.token_expire_time - new Date().getTime();
		if (difference > 0) {
			timeLeft = difference;
		}
	}
	return timeLeft;
};
