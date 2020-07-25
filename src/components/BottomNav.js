import React, { Component } from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonRouterOutlet } from '@ionic/react';
import { Redirect } from 'react-router-dom';
import '../assets/stylesheets/BottomNav.css';

class BottomNav extends Component {
	render() {
		return (
			<IonTabs>
				<IonRouterOutlet className="router-outlet">
					<Redirect exact path="/" to="/discover" />
				</IonRouterOutlet>
				<IonTabBar slot="bottom">
					<IonTabButton tab="discover" href="/discover">
						Home
					</IonTabButton>
					<IonTabButton tab="search" href="/search">
						Search
					</IonTabButton>
					<IonTabButton tab="library" href="/library">
						Library
					</IonTabButton>
					<IonTabButton tab="about" href="/about">
						About
					</IonTabButton>
				</IonTabBar>
			</IonTabs>
		);
	}
}

export default BottomNav;
