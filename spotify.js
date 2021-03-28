// each one will become more specific:
// (skateboard) general genre playlist
// (motorbike) spcific playlist
// (car) specific songs
// (rocket ship) adding specific songs adding to a new playlist

// moods:
// Surprise 
// Fear
// Disgust
// Contempt
// Anger
// Sadness
// Happiness 
// neutral 

// Maybe create a html file with buttons with the major emotions
// have buttons create song(s) from api(s)
// populate onto page
// progress if possible

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// https://github.com/tombaranowicz/SpotifyPlaylistExport/blob/master/index.js
// https://www.npmjs.com/package/spotify-web-api-node
// modified for project: curl -H "Authorization: Basic ZjM...zE=" -d grant_type=authorization_code -d code=MQCbtKe...44KN -d redirect_uri=https%3A%2F%2Fwww.foo.com%2Fauth https://accounts.spotify.com/api/token


// Require everything!!
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'ace5f2d6e3af4a78af05061f9a27201c',
  clientSecret: 'e8b317a8d6c542539b218d2795b70aea',
  redirectUri: 'http://localhost:8888/callback'
});

const app = express();

// array from 34
app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  console.log('line 71');

  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      console.log('line 84');
      const access_token = data.body['access_token'];
      console.log('line 86');
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send('Success! You can now close the window.');

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);

// as per site:
// Lastly, use the wrapper's helper methods to make the request to Spotify's Web API. 
// The wrapper uses promises, so you need to provide a success callback as well as an error callback.
// Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );

// with no promises:
//   // Get Elvis' albums
// spotifyApi.getArtistAlbums(
//     '43ZHCT0cAZBISjO8DG9PnE',
//     { limit: 10, offset: 20 },
//     function(err, data) {
//       if (err) {
//         console.error('Something went wrong!');
//       } else {
//         console.log(data.body);
//       }
//     }
//   );

// {
//     "body" : {
  
//     },
//     "headers" : {
  
//     },
//     "statusCode" :
// }

// Get available genre seeds
// spotifyApi.getAvailableGenreSeeds()
//   .then(function(data) {
//     let genreSeeds = data.body;
//     console.log(genreSeeds);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

