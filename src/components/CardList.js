import React, { Component } from 'react';
import { IonList, IonItem, IonAvatar, IonLabel, IonNote, IonButton } from '@ionic/react';
import { connect } from 'react-redux';
import { addRating, onPlaylistClick, onUserClick } from '../helpers';
import '../assets/stylesheets/CardList.css';
import StarRatings from 'react-star-ratings';

const CardList = ({ auth, data }) => {
	console.log(data);
	return (
		<IonList mode="ios" lines="none" className="list">
			{data.map((item, index) => {
				if (item.userId !== auth.user.id) {
					return (
						<IonItem className="list-item">
							<IonAvatar slot="start" className="item-avatar" alt="list-item">
								<img src={item.images[0].url} />
							</IonAvatar>
							<IonLabel slot="start" style={{ marginBottom: '20px', marginLeft: '20px', zIndex: 200 }}>
								<IonItem>
									<IonLabel
										slot="start"
										className="playlist-name"
										onClick={() => onPlaylistClick(item.playlistId)}
									>
										{item.playlistName}
									</IonLabel>
									<IonLabel slot="end">
										<IonButton>Rate</IonButton>
									</IonLabel>
								</IonItem>
								<IonItem>
									<IonNote
										slot="start"
										className="user-name"
										onClick={() => onUserClick(item.userId)}
									>
										{item.userName}
									</IonNote>
									<IonNote slot="end">
										<StarRatings rating={2.4} starSpacing="2px" starDimension="20px" />
										{/* <StarRatings rating={item.overallRating} /> */}
									</IonNote>
								</IonItem>
							</IonLabel>
						</IonItem>
					);
				} else {
					return null;
				}
			})}
		</IonList>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	};
};

export default connect(mapStateToProps)(CardList);
