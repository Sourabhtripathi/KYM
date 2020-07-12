import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, auth }) => (
	<Route render={(props) => (auth.isAuthenticated ? <Component {...props} /> : <div>Not a private route</div>)} />
);

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
