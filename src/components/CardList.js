import React, { Component, useState } from "react";
import {
  IonList,
  IonItem,
  IonAvatar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonCard,
} from "@ionic/react";
import { connect } from "react-redux";
import { addRating, onPlaylistClick, onUserClick } from "../helpers";
import "../assets/stylesheets/CardList.css";
import StarRatings from "react-star-ratings";
import { addToRatedBy } from "../actions";
import default_playlist from "../assets/images/logo1.png";

const CardList = ({ auth, data, addToRatedBy, ...props }) => {
  const [modalState, setModalState] = useState({
    playlist: {
      playlistName: "",
      playlistId: "",
    },
    index: -1,
    rating: 0,
    isOpen: false,
  });

  const closeModal = () => {
    setModalState({
      isOpen: false,
      index: -1,
      rating: 0,
      playlist: {
        playlistName: "",
        playlistId: "",
      },
    });
  };

  const changeRating = (newRating) => {
    setModalState({
      ...modalState,
      rating: newRating,
    });
  };

  const onRatingSubmit = async () => {
    const { playlist, rating } = modalState;

    const res = await addRating(playlist.playlistId, auth.user.id, rating);
    if (res.status === 200) {
      const data = {
        index: modalState.index,
        data: res.data,
      };

      addToRatedBy(data);
    }
    closeModal();
  };

  const isRated = (ratedBy) => {
    for (const i in ratedBy) {
      if (ratedBy[i] === auth.user.id) {
        return true;
      }
    }
    return false;
  };

  const renderRatingOption = (playlist, index) => {
    if (auth.user.id !== playlist.userId && !isRated(playlist.ratedBy)) {
      return (
        <IonButton
          class="rate-button"
          onClick={() =>
            setModalState({ isOpen: true, index, playlist, rating: 0 })
          }
        >
          Rate
        </IonButton>
      );
    } else {
      return null;
    }
  };

  console.log(modalState);

  return (
    <IonList mode="ios" lines="none" className="list">
      {data.map((item, index) => {
        if (item.userId !== auth.user.id) {
          return (
            <IonItem className="list-item">
              <IonAvatar slot="start" className="item-avatar" alt="list-item">
                <img
                  src={
                    item.images.length > 0
                      ? item.images[0].url
                      : default_playlist
                  }
                />
              </IonAvatar>
              <IonGrid className="grid">
                <IonRow className="row">
                  <IonCol
                    className="playlist-name"
                    onClick={() => onPlaylistClick(item.playlistId)}
                  >
                    {item.playlistName}
                  </IonCol>
                  <IonCol>{renderRatingOption(item, index)}</IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="4">
                    <p
                      className="username"
                      onClick={() => onUserClick(item.userId)}
                    >
                      {item.userName}
                    </p>
                  </IonCol>
                  <IonCol size="8">
                    <StarRatings
                      rating={item.overallRating}
                      starSpacing="2px"
                      starDimension="20px"
                      starRatedColor="#fcba03"
                    />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          );
        } else {
          return null;
        }
      })}
      <IonModal
        isOpen={modalState.isOpen}
        cssClass="rate-modal"
        onDidDismiss={closeModal}
      >
        <IonCard className="rate-card">
          <h1 className="rating-heading">
            How do you like {modalState.playlist.playlistName}
          </h1>
          <StarRatings
            rating={modalState.rating}
            starRatedColor="#fcba03"
            starHoverColor="#fcba03"
            changeRating={changeRating}
            numberOfStars={5}
            starSpacing="2px"
            starDimension="40px"
          />
          <IonButton
            className="rating-button"
            onClick={onRatingSubmit}
            disabled={modalState.rating === 0 ? true : false}
          >
            Submit
          </IonButton>
        </IonCard>
      </IonModal>
    </IonList>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, { addToRatedBy })(CardList);
