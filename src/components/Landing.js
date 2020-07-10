import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { serverUrl } from '../variables';

const Landing = (props) => {
	const renderLoginButton = () => {
		return <a href={`${serverUrl}/login`}>Login with Spotify</a>;
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
