// Random point plot for Dublin

var redis = require("redis"),
client = redis.createClient();

var request = require("request");

var gpxParse = require("gpx-parse");

var velodrome = require("velodrome");
var courier   = new velodrome("O8BSqgq1KPGRAHWMiOLWsZbczpllum3T", "qun25y1odny9fhOPzwLtHtTXbFVgO3IW")

var city = {
	"southwest_boundary": [53.251247, -6.385117],
    "northeast_boundary": [53.634868, -6.022568]
};

var plot = require("plotter").plot;

function randomPos(min, max)
{
    return Math.random() * (max - min) + min;
}

var locs = {};

// Create a loop and spew out random coordinates
for (var i = 0; i < 1000; i++) {
	var lat = randomInt(city.southwest_boundary[0], city.northeast_boundary[0]);
	var lng = randomInt(city.southwest_boundary[1], city.northeast_boundary[1]);

	locs[lng] = lat;
}

plot({
    data:       { "Locations": locs },
    filename:   "output.png",
    style:      "points",
    xlabel:     "Longitude",
    ylabel: 	"Latitude"
});