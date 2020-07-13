import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { serverUrl } from '../variables';

const Landing = (props) => {
	const onLogin = () => {
		window.open(`${serverUrl}/login`);
	};

	const renderLoginButton = () => {
		return (
			<div>
				<a href={`${serverUrl}/login`}>Login with Spotify</a>
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
