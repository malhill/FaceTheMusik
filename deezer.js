var unirest = require("unirest");

var req = unirest("GET", "https://deezerdevs-deezer.p.rapidapi.com/genre/%7Bid%7D");

req.headers({
	"x-rapidapi-key": "SIGN-UP-FOR-KEY",
	"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});