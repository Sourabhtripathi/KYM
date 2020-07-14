import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { serverUrl, clientUrl, scopes } from '../variables';

const Landing = (props) => {
	const onLogin = () => {};

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
