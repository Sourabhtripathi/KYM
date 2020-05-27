import React from 'react';
import { IonContent } from '@ionic/react';
import { serverUrl } from '../variables';
import { login } from '../helpers';

const Landing = () => {
	const onLogin = async () => {
		const res = await login();
		console.log(res);
	};

	return (
		<IonContent>
			<h1>Landing</h1>
			<a href={`${serverUrl}/login`}>Login with Spotify</a>
			<button onClick={onClick}>Login</button>
		</IonContent>
	);
};
export default Landing;
