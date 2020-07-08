import React, { Component } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { IonApp, IonGrid, IonRow, IonCol, IonRouterOutlet, IonContent } from '@ionic/react';
import { Route } from 'react-router-dom';
import Discover from './Discover';
import Search from './Search';
import Library from './Library';
import About from './About';
import { IonReactRouter } from '@ionic/react-router';

import '../../assets/stylesheets/App.css';

class App extends Component {
	render() {
		return (
			<IonApp>
				<IonReactRouter>
					<IonRouterOutlet id="main">
						<IonGrid>
							<IonRow>
								<IonCol size-xs="0" size-md="2">
									<Sidebar />
								</IonCol>
								<IonCol size-xs="12" size-md="10">
									<IonContent className="display-content">
										<Route exact path="/discover" exact component={Discover} />
										<Route exact path="/search" exact component={Search} />
										<Route exact path="/library" exact component={Library} />
										<Route exact path="/about" exact component={About} />
									</IonContent>
								</IonCol>
								<IonCol size-xs="12" size-md="0" className="toolbar">
									<Route path="/" component={BottomNav} />
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonRouterOutlet>
				</IonReactRouter>
			</IonApp>
		);
	}
}

export default App;
