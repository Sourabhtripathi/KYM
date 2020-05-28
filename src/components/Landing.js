import React from 'react';
import { IonContent } from '@ionic/react';
import { serverUrl } from '../variables';
import { authorize } from '../helpers';

const Landing = () => {
	const onAuthClick = () => {
		authorize();
	};

	return (
		<IonContent>
			<h1>Landing</h1>
			<a href={`${serverUrl}/login`}>Login with Spotify</a>
			<button onClick={onAuthClick}>Native Auth</button>
		</IonContent>
	);
};
export default Landing;
