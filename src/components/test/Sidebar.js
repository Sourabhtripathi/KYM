import React, { Component } from 'react';
import { IonNav, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

class Sidebar extends Component {
	render() {
		return (
			<IonNav>
				<IonHeader>
					<IonToolbar color="primary">
						<IonTitle>Start Menu</IonTitle>
					</IonToolbar>
				</IonHeader>
			</IonNav>
		);
	}
}

export default Sidebar;
