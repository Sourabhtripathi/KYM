import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const Toolbar = () => {
	const [ type, setType ] = useState('playlists');

	useEffect(() => {}, [ type ]);
	return (
		<div style={{ position: 'fixed', bottom: 10, margin: '0 auto' }}>
			<span style={{ margin: '10px' }}>
				<Link to="/discover">Discover</Link>
			</span>
			<span style={{ margin: '10px' }}>
				<Link to="/search">Search</Link>
			</span>
			<span style={{ margin: '10px' }}>
				<Link to="/library">Library</Link>
			</span>
			<span style={{ margin: '10px' }}>
				<Link to="/profile">Profile</Link>
			</span>
			<span style={{ margin: '10px' }}>
				<Link to="/about">About</Link>
			</span>
		</div>
	);
};
export default Toolbar;
