import React, { useEffect } from 'react';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

const AppUrlListener = (props) => {
	useEffect(() => {
		console.log(window.location);
		// const slug = window.location.href.url.split('.app').pop();
		// console.log(slug);
		App.addListener('appUrlOpen', (any) => {
			console.log('here');
			// Example url: https://beerswift.app/tabs/tab2
			// slug = /tabs/tab2

			console.log('here1');
			window.open('https://www.flipkart.com/');
			// if (slug) {
			// 	props.history.push(slug);
			// }
			// If no match, do nothing - let regular routing
			// logic take over
		});
	}, []);

	return null;
};

export default AppUrlListener;
