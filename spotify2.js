const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQDDfVXrVgVd9t-WTnL5tJ0WH9cz6Ose7Eey4DnvcgKpSdFKnIBhnO-iZYCSoQz__zMnQexNkiZNXyA4mJhG8A-g6NlmnX2KRewBbuoFHY73NvxlRZD_KjYgdfjHAVFSxrmvAKBCaWOepocFtvBFKxhKHWzD5N8hf2qHXLCs9ooun6WBM4DTY5eHY_1Ivq4At2IgJEZKfEbDVT0IFjPxWX2vZPr2PBMyL1unwaYKyJwfEMBPLqgaikgukaYLH_rnZ-ewKxr0XLbf-yyU6BPDLpzfNjxGdwY";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {
  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();