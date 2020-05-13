import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const Header = (props) => {
	useEffect(() => {}, []);
	return (
		<div>
			<h4>Signed in as {props.user.display_name}</h4>
		</div>
	);
};

const mapStateTopProps = (state) => {
	return {
		user: state.auth.user
	};
};
export default connect(mapStateTopProps)(Header);
