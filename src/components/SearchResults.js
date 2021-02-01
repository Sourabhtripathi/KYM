import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { search } from "../helpers";
import default_avatar from "../assets/images/default_avatar.jpg";
import { onPlaylistClick, onUserClick } from "../helpers";
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonAvatar,
} from "@ionic/react";
import CardList from "./CardList";
import { compose } from "redux";

const SearchResults = ({ query, openPlaylists, registeredUsers, ...props }) => {
  const [playlistContent, setPlaylistContent] = useState([]);
  const [userContent, setUserContent] = useState([]);
  useEffect(() => {
    // Playlists
    let keys = ["playlistName"];
    let options = {
      caseSensitive: false,
      sort: true,
    };
    let result = search(openPlaylists, keys, query, options);
    setPlaylistContent(result);
    keys = ["name"];
    result = search(registeredUsers, keys, query, options);
    console.log(result);
    setUserContent(result);
  }, [query]);

  const renderPlaylistResults = () => {
    if (playlistContent.length === 0) {
      return (
        <div>
          <h2>No Playlist found</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Playlists</h1>
          <CardList data={playlistContent} />
        </div>
      );
    }
  };

  const renderUserResults = () => {
    if (userContent.length === 0) {
      return (
        <div>
          <h2>No User found</h2>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Users</h1>
          {userContent.map((user, index) => {
            if (user.spotifyId !== props.auth.user.id) {
              return (
                <IonItem className="list-item">
                  <IonAvatar
                    slot="start"
                    className="item-avatar"
                    alt="list-item"
                  >
                    <img src={user.images[0].url} />
                  </IonAvatar>
                  <IonGrid className="grid">
                    <IonRow className="row">
                      <IonCol
                        className="playlist-name"
                        onClick={() => onUserClick(user.id)}
                      >
                        {user.name}
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <p className="username">
                          {user.openPlaylists.length} open playlists
                        </p>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
              );
            } else {
              return null;
            }
          })}
        </div>
      );
    }
  };

  if (query === "") {
    return (
      <div>
        <h2>Search for a playlist or a user</h2>
      </div>
    );
  } else {
    return (
      <IonContent>
        {renderPlaylistResults()}
        {renderUserResults()}
      </IonContent>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    openPlaylists: state.user.openPlaylists,
    registeredUsers: state.db.registeredUsers,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SearchResults);
