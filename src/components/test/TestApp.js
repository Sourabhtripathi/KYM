import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useAuth } from 'react-use-auth';

import { serverUrl, clientUrl } from './variables';
import Landing from './Landing';

const TestApp = (props) => {
	const { handleAuthentication, user } = useAuth();
	useEffect(async () => {
		// console.log(user);
		// handleAuthentication({ postLoginRoute: '/account' });
	}, []);

	console.log('app return');
	return <Landing />;
};
const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.user
});
export default connect(mapStateToProps, {})(TestApp);
