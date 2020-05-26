import React, { useEffect } from 'react';

const AppUrlListener = (props) => {
	useEffect(() => {
		const slug = window.location.pathname;
		console.log(slug);
	}, []);

	return null;
};

export default AppUrlListener;
