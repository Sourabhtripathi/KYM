import React from 'react';
import { IonContent } from '@ionic/react';
import { serverUrl } from '../variables';

const Landing = () => {
	return (
		<IonContent>
			<h1>Landing</h1>
			<a href={`${serverUrl}/login`}>Login with Spotify</a>
		</IonContent>
	);
};
export default Landing;
