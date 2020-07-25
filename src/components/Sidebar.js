import React, { Component, Fragment } from 'react';
import { IonList, IonCard, IonCardContent, IonCardHeader, IonIcon, IonAvatar } from '@ionic/react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo2.png';
import '../assets/stylesheets/Sidebar.css';
import { homeOutline, searchOutline, libraryOutline, bugOutline } from 'ionicons/icons';

const cardList = [
	{
		text: 'Home',
		url: '/discover',
		icon: homeOutline
	},
	{
		text: 'Search',
		url: '/search',
		icon: searchOutline
	},
	{
		text: 'Library',
		url: '/library',
		icon: libraryOutline
	},
	{
		text: 'About',
		url: '/about',
		icon: bugOutline
	}
];

class Sidebar extends Component {
	state = {
		activeCard: 0
	};
	componentDidMount() {
		cardList.forEach((card, index) => {
			if (card.url === this.props.location.pathname) {
				this.setState({
					activeCard: index
				});
			}
		});
	}

	renderList = () => {
		return (
			<IonList className="side-list">
				{cardList.map((card, index) => {
					return (
						<Link
							className="nav-link"
							to={card.url}
							onClick={() => {
								this.setState({
									activeCard: index
								});
							}}
						>
							<IonCard
								button="true"
								className={`nav-card ${index === this.state.activeCard ? 'active' : null}`}
							>
								<div className="cardContent">
									<IonIcon icon={card.icon} />
									<IonCardContent>{card.text}</IonCardContent>
								</div>
							</IonCard>
						</Link>
					);
				})}
			</IonList>
		);
	};

	render() {
		return (
			<Fragment>
				<IonCardHeader className="side-header">
					<div className="profile-button">
						<IonAvatar className="profile-photo">
							<img alt="profile" src={logo} />
						</IonAvatar>
					</div>
				</IonCardHeader>
				{this.renderList()}
			</Fragment>
		);
	}
}

export default Sidebar;
