import React from "react";
import { IonGrid, IonRow, IonCol, IonIcon } from "@ionic/react";
import "../assets/stylesheets/CardGrid.css";
import default_playlist from "../assets/images/logo1.png";
import StarRatings from "react-star-ratings";
import {
  onPlaylistClick,
  addOpenPlaylist,
  removeOpenPlaylist,
} from "../helpers";

import { addCircle, removeCircle } from "ionicons/icons";

const gradients = [
  ["#CE9FFC", "#7367F0"],
  ["#13f1fc", "#0470dc"],
  ["#F5515F", "#A1051D"],
  ["#42e695", "#3bb2b8"],
  ["#f2d50f", "#da0641"],
];

const CardGrid = ({ playlists, togglePlaylist }) => {
  console.log(playlists);

  const togglePlaylistStatus = async (playlist, index) => {
    if (playlist.open) {
      await removeOpenPlaylist(playlist.id);
      togglePlaylist(index);
    } else {
      const body = {
        userId: playlist.owner.id,
        userName: playlist.owner.display_name,
        playlistId: playlist.id,
        playlistName: playlist.name,
        overallRating: 0,
        totalRating: 0,
        ratedBy: [],
        images: [...playlist.images],
      };
      await addOpenPlaylist(body);
      togglePlaylist(index);
    }
  };

  const renderToggleIcon = (playlist, index) => {
    if (!togglePlaylist) return null;
    return (
      <IonIcon
        icon={playlist.open ? removeCircle : addCircle}
        className="toggle-openplaylist-icon"
        onClick={() => togglePlaylistStatus(playlist, index)}
      />
    );
  };

  return (
    <IonGrid>
      <IonRow>
        {playlists.map((playlist, index) => (
          <IonCol size-xl="3" size-lg="4" size-md="4" size-sm="4" size-xs="6">
            <div className="grid-card">
              <div className="upper-div"></div>
              <div
                className="card-div"
                style={{
                  background: `linear-gradient(135deg, ${
                    gradients[index % gradients.length][0]
                  } 0%,${gradients[index % gradients.length][1]} 100%)`,
                }}
              >
                <img
                  src={
                    playlist.images.length > 0
                      ? playlist.images[0].url
                      : default_playlist
                  }
                />
                {renderToggleIcon(playlist, index)}

                <StarRatings
                  rating={playlist.rating}
                  starRatedColor="#ffffff"
                  starEmptyColor="#9e9e9b"
                  starHoverColor="#fcba03"
                  numberOfStars={5}
                  starSpacing="2px"
                  starDimension="20px"
                />
              </div>
              <div
                className="lower-div"
                onClick={() => onPlaylistClick(playlist.id)}
              >
                {playlist.name}
              </div>
            </div>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};

export default CardGrid;
