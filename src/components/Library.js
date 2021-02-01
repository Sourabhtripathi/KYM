import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addToOpenPlaylists,
  removeFromOpenPlaylists,
  togglePlaylist,
} from "../actions";
import {
  addOpenPlaylist,
  removeOpenPlaylist,
  onPlaylistClick,
} from "../helpers";
import CardGrid from "./CardGrid";
import Wrapper from "./Wrapper";

const Library = (props) => {
  const [owned, setOwned] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [followedPlaylists, setfollowedPlaylists] = useState([]);

  useEffect(() => {
    let myPlaylists = [];
    let followedPlaylists = [];
    props.myPlaylists.forEach((playlist) => {
      if (playlist.owner.id === props.user.id) {
        myPlaylists.push(playlist);
      } else {
        followedPlaylists.push(playlist);
      }
    });
    setMyPlaylists(myPlaylists);
    setfollowedPlaylists(followedPlaylists);
  }, [props.myPlaylists]);

  const renderRating = (index) => {
    if (props.myPlaylists[index].open) {
      return <div>{props.myPlaylists[index].rating}</div>;
    } else {
      return null;
    }
  };
  const onAddClick = async (pid, pname, uid, uname, images, i) => {
    const body = {
      userId: uid,
      userName: uname,
      playlistId: pid,
      playlistName: pname,
      overallRating: 0,
      totalRating: 0,
      ratedBy: [],
      images: [...images],
    };
    await addOpenPlaylist(body);
    const payload = {
      index: i,
      val: true,
    };
    props.togglePlaylist(payload);
    props.addToOpenPlaylists(body);
  };

  const onRemoveClick = async (pid, i) => {
    await removeOpenPlaylist(pid);
    const payload = {
      index: i,
      val: false,
    };
    props.togglePlaylist(payload);
    props.removeFromOpenPlaylists(i);
  };

  const renderButton = (index) => {
    if (!props.myPlaylists[index].open) {
      return (
        <button
          onClick={() => {
            onAddClick(
              props.myPlaylists[index].id,
              props.myPlaylists[index].name,
              props.user.id,
              props.user.display_name,
              props.myPlaylists[index].images,
              index
            );
          }}
        >
          Add to Open Playlists
        </button>
      );
    } else {
      return (
        <button
          onClick={() => {
            onRemoveClick(props.myPlaylists[index].id, index);
          }}
        >
          Remove from Open Playlists
        </button>
      );
    }
  };

  const togglePlaylist = (index) => {
    let playlists = [...myPlaylists];
    playlists[index].open = !playlists[index].open;
    setMyPlaylists(playlists);
  };

  return (
    <Fragment>
      <h3>My Playlists</h3>
      <CardGrid playlists={myPlaylists} togglePlaylist={togglePlaylist} />
      <h3>Followed Playlists</h3>
      <CardGrid playlists={followedPlaylists} />
    </Fragment>
    // <Fragment>
    //   <h3>My Playlists</h3>
    //   {/* <CardGrid
    //     playlists={myPlaylists}
    //     setMyPlaylists={setMyPlaylists}
    //     setfollowedPlaylists={setfollowedPlaylists}
    //   />
    //   <h3>Followed Playlists</h3>
    //   <CardGrid
    //     playlists={myPlaylists}
    //     setMyPlaylists={setMyPlaylists}
    //     setfollowedPlaylists={setfollowedPlaylists}
    //   /> */}
    //   <ul>
    //     {props.myPlaylists.map((playlist, index) => {
    //       if (playlist.owner.id === props.user.id) {
    //         if (!owned) setOwned(true);
    //         return (
    //           <li key={index}>
    //             <div>
    //               <header>
    //                 <span
    //                   className="playlist"
    //                   onClick={() => onPlaylistClick(playlist.id)}
    //                 >
    //                   {playlist.name}{" "}
    //                 </span>
    //               </header>
    //               <img
    //                 alt="playlist"
    //                 src={
    //                   playlist.images.length > 0
    //                     ? playlist.images[0].url
    //                     : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFLTljzZeMhL0Wi1_mRphuhtBSidevH9pkGQ&usqp=CAU"
    //                 }
    //                 style={{ height: "100px", width: "100px" }}
    //               />
    //               {renderRating(index)}
    //               {renderButton(index)}
    //             </div>
    //           </li>
    //         );
    //       } else {
    //         return null;
    //       }
    //     })}
    //     {!owned ? <div>Nothing here</div> : null}
    //   </ul>
    //   <h3>Followed Playlists</h3>
    //   <ul>
    //     {props.myPlaylists.map((playlist, index) => {
    //       if (playlist.owner.id !== props.user.id) {
    //         if (!followed) setFollowed(true);
    //         return (
    //           <li key={index}>
    //             <div>
    //               <header>
    //                 <span
    //                   className="playlist"
    //                   onClick={() => onPlaylistClick(playlist.id)}
    //                 >
    //                   {playlist.name}{" "}
    //                 </span>
    //               </header>
    //               <img
    //                 alt="playlist"
    //                 src={playlist.images[0].url}
    //                 style={{ height: "100px", width: "100px" }}
    //               />
    //               {renderRating(index)}
    //             </div>
    //           </li>
    //         );
    //       } else {
    //         return null;
    //       }
    //     })}
    //     {!followed ? <div>Nothing here</div> : null}
    //   </ul>
    // </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    myPlaylists: state.user.myPlaylists,
  };
};

const conf = {
  title: "Library",
};

export default Wrapper(
  connect(mapStateToProps, {
    addToOpenPlaylists,
    removeFromOpenPlaylists,
    togglePlaylist,
  })(Library),
  conf
);
