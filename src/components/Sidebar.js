import React, { Component, Fragment } from 'react';
import {
	IonContent,
	IonToolbar,
	IonTitle,
	IonList,
	IonCard,
	IonCardContent,
	IonCardTitle,
	IonCardHeader,
	IonIcon,
	IonAvatar
} from '@ionic/react';
import homeIcon from '../assets/images/home-outline.svg';
import searchIcon from '../assets/images/search-outline.svg';
import libraryIcon from '../assets/images/library-outline.svg';
import aboutIcon from '../assets/images/bug-outline.svg';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo2.png';
import '../assets/stylesheets/Sidebar.css';

class Sidebar extends Component {
	componentDidMount() {
		console.log(this.props);
	}
	render() {
		return (
			<Fragment>
				<IonCardHeader className="side-header">
					<div className="profile-button">
						<IonAvatar className="profile-photo">
							<img src={logo} />
						</IonAvatar>
					</div>
				</IonCardHeader>
				<IonList className="side-list">
					<Link className="nav-link" to="/discover">
						<IonCard button="true" className="nav-card">
							<div className="cardContent">
								<IonIcon icon={homeIcon} />
								<IonCardContent>Home</IonCardContent>
							</div>
						</IonCard>
					</Link>
					<Link className="nav-link" to="/search">
						<IonCard button="true" className="nav-card">
							<div className="cardContent">
								<IonIcon icon={searchIcon} />
								<IonCardContent>Search</IonCardContent>
							</div>
						</IonCard>
					</Link>
					<Link className="nav-link" to="/library">
						<IonCard button="true" className="nav-card">
							<div className="cardContent">
								<IonIcon icon={libraryIcon} />
								<IonCardContent>Library</IonCardContent>
							</div>
						</IonCard>
					</Link>
					<Link className="nav-link" to="/about">
						<IonCard button="true" className="nav-card">
							<div className="cardContent">
								<IonIcon icon={aboutIcon} />
								<IonCardContent>About</IonCardContent>
							</div>
						</IonCard>
					</Link>
				</IonList>
			</Fragment>
		);
	}
}

export default Sidebar;
