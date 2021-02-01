import server from "../apis/server";
import isEmpty from "is-empty";
import SpotifyWebApi from "spotify-web-api-js";
import FuzzySearch from "fuzzy-search";
import { Plugins } from "@capacitor/core";
const spotifyApi = new SpotifyWebApi();
const { Storage, Browser, Device, Toast, App } = Plugins;

// App
export const urlOpenListener = () => {
  App.addListener("appUrlOpen", (data) => {
    // console.log(JSON.stringify(data.url));
    return data;
  });
};

// Toast
export const showToast = async (text) => {
  await Toast.show({ text: text });
};

// Device functions
export const getDeviceInfo = async () => {
  return await Device.getInfo();
};

// Browser functions
export const openBrowser = async (url) => {
  await Browser.open({ url: url });
};

export const closeBrowser = async () => {
  await Browser.close();
};

// Storage functions
export const setStorage = async (key, value) => {
  await Storage.set({ key: key, value: value });
};

export const getStorage = async (key) => {
  const { value } = await Storage.get({ key: key });
  return value;
};

export const removeStorage = async (key) => {
  await Storage.remove({ key });
};

// Auth Configuration

export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
};

export const setMe = () => {
  return spotifyApi.getMe().then((response) => {
    return response;
  });
};

export const getParams = (url) => {
  if (isEmpty(url)) {
    return {};
  }
  const str = url.substring(1);
  let pieces = str.split("&"),
    data = {},
    i,
    parts;
  // process each query pair
  for (i = 0; i < pieces.length; i++) {
    parts = pieces[i].split("=");
    if (parts.length < 2) {
      parts.push("");
    }
    data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return JSON.parse(Object.keys(data)[0]);
};

export const isValid = () => {
  const d = new Date();
  if (d.getTime() <= parseInt(localStorage.token_expire_time)) return true;
  return false;
  // return getStorage('token_expire_time').then((data) => {
  // if (d.getTime() <= parseInt(data)) return true;
  // return false;
  // });
};

export const isValid_a = () => {
  const d = new Date();

  return getStorage("token_expire_time").then((data) => {
    if (d.getTime() <= parseInt(data)) return true;
    return false;
  });
};

export const updateTokens = (params) => {
  let d = new Date();
  d.setSeconds(d.getSeconds() + 5);
  // d.setSeconds(d.getSeconds() + 3600);
  if (!params.refresh_token) {
    // refreshed token-- just change access token and time
    localStorage.setItem("access_token", params.access_token);
    localStorage.setItem("token_expire_time", d.getTime());

    // setStorage('access_token', params.access_token);
    // setStorage('token_expire_time', d.getTime());
    // closeBrowser();
  } else {
    localStorage.setItem("access_token", params.access_token);
    localStorage.setItem("refresh_token", params.refresh_token);
    localStorage.setItem("token_expire_time", d.getTime());

    // setStorage('refresh_token', params.refresh_token);
    // setStorage('token_expire_time', d.getTime());
  }
  // return getStorage('access_token').then((data) => {
  // 	return data;
  // });
};
export const updateTokens_a = (params) => {
  let d = new Date();
  d.setSeconds(d.getSeconds() + 5);
  console.log(d.getTime());
  // d.setSeconds(d.getSeconds() + 3600);
  if (!params.refresh_token) {
    // refreshed token-- just change access token and time
    return setStorage("access_token", params.access_token).then((data) => {
      return setStorage("token_expire_time", JSON.stringify(d.getTime())).then(
        (tet) => {
          let val = "successful";
          return val;
        }
      );
    });
  } else {
    return setStorage("access_token", params.access_token).then((data) => {
      return setStorage("token_expire_time", JSON.stringify(d.getTime())).then(
        (tet) => {
          return setStorage("refresh_token", params.refresh_token).then(
            (d1) => {
              return getStorage("token_expire_time").then((time) => {
                let val = "successful";
                return val;
              });
            }
          );
        }
      );
    });
  }
};

// Fetch content from spotify api

export const getMyTopTracks = (user) => {
  const obj = {
    limit: 10,
  };
  return spotifyApi.getMyTopTracks(obj).then(async (response) => {
    await server.put(`/setTopTracks?spotifyId=${user}`, {
      topTracks: response.items,
    });
    return response;
  });
};

export const getUserPlaylists = (user) =>
  spotifyApi.getUserPlaylists(user).then((res) => res.items);

// Fetch playlist details
export const getPlaylist = (pid) =>
  spotifyApi.getPlaylist(pid).then((response) => response);

export const areFollowingPlaylist = (pid, users) =>
  spotifyApi.areFollowingPlaylist(pid, users).then((response) => response);

export const followPlaylist = (pid) =>
  spotifyApi.followPlaylist(pid).then((response) => response);

export const unfollowPlaylist = (pid) =>
  spotifyApi.unfollowPlaylist(pid).then((response) => response);

export const getUserInfo = (uid) =>
  spotifyApi.getUser(uid).then((response) => response);

// Api requests on own server
export const addOpenPlaylist = async (body) => {
  const response = await server.post("/add_open_playlist", body);
  return response;
};

export const removeOpenPlaylist = async (pid) => {
  const response = await server.delete(`/remove_open_playlist/${pid}`);
  return response;
};

export const getOpenPlaylists = async () => {
  const response = await server.get("/open_playlists");
  return response;
};

export const getOpenPlaylist = async (pid) => {
  const response = await server.get(`/open_playlist/${pid}`);
  return response;
};

export const getRegisteredUsers = async () => {
  const response = await server.get("/users");
  return response;
};

export const addRating = async (pid, uid, rating) => {
  const body = {
    userId: uid,
    rating: rating,
  };
  const response = await server.put(`/open_playlist/rate/${pid}`, body);
  return response;
};
// General functions

export const found = (array, value) => {
  let retVal = { found: false, rating: 0 };
  for (const i in array) {
    if (array[i].playlistId === value) {
      retVal.rating = array[i].overallRating;
      retVal.found = true;
      break;
    }
  }
  return retVal;
};

export const compareValues = (a, b) => {
  if (a > b) return b - a;
  else return a - b;
};

export const onPlaylistClick = (id) => {
  window.open(`https://open.spotify.com/playlist/${id}`);
};

export const onUserClick = (id) => {
  window.open(`https://open.spotify.com/user/${id}`);
};

export const search = (haystack, keys, needle, options) => {
  const searcher = new FuzzySearch(haystack, keys, options);
  const result = searcher.search(needle);
  return result;
};
