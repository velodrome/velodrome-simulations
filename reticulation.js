// Reticulation test for Dublin

var redis = require("redis"),
client = redis.createClient();

var request = require("request");

var gpxParse   = require("gpx-parse");
var geo        = require("geolib");
var gmaps      = require("googlemaps");
var poly       = require("polyline-encoded");

var fs = require("fs");

var publicConfig = {
  key: "AIzaSyD6QoewSQ2G18W10u1pBF3XM5Iv7Rd6jiY",
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true // use https
};
var maps = new gmaps(publicConfig);

var velodrome = require("velodrome");
var courier   = new velodrome("O8BSqgq1KPGRAHWMiOLWsZbczpllum3T", "qun25y1odny9fhOPzwLtHtTXbFVgO3IW")

var city = {
	"southwest_boundary": [53.251247, -6.385117],
    "northeast_boundary": [53.579861, -6.107120]
};

var plot = require("plotter").plot;
var trials = [];
var reticulations = [];


var api_base = "https://localhost";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function randomInt(min, max)
{
    return Math.random() * (max - min) + min;
}

var locs = {};
var i = 0;

// Create a loop and spew out random coordinates
function runCalcs() {
	if (i < 1000) {
		var origin = [
			randomInt(city.southwest_boundary[0], city.northeast_boundary[0]), 
			randomInt(city.southwest_boundary[1], city.northeast_boundary[1])
		];

		var destination = [
			randomInt(city.southwest_boundary[0], city.northeast_boundary[0]), 
			randomInt(city.southwest_boundary[1], city.northeast_boundary[1])
		];

		maps.directions({
			origin: origin.join(", "), 
			destination: destination.join(", ")
		}, function (err, data) {
			if (err) throw err;
			var road_distance = data.routes[0].legs[0].distance.value;
			var straight_distance = geo.getDistance({
				latitude: data.routes[0].legs[0].start_location.lat,
				longitude: data.routes[0].legs[0].start_location.lng
			}, {
				latitude: data.routes[0].legs[0].end_location.lat,
				longitude: data.routes[0].legs[0].end_location.lng
			});

			var results = {
				origin: [ data.routes[0].legs[0].start_location.lat, data.routes[0].legs[0].start_location.lng ],
				destination: [ data.routes[0].legs[0].end_location.lat, data.routes[0].legs[0].end_location.lng ],
				road: road_distance,
				straight: straight_distance,
				reticulation: (road_distance / straight_distance)
			};

			reticulations.push(road_distance / straight_distance);
			trials[i] = results;

			var polyline = {};
			var straight_polyline = {};

			var sum = reticulations.reduce(function(a, b) { return a + b; });
			var avg = sum / reticulations.length;

			console.log("Reticulation factor: " + avg);
			fs.writeFile("reticulation.json", JSON.stringify(trials));

			// for (var step in data.routes[0].legs[0].steps) {
			// 	var this_step = data.routes[0].legs[0].steps[step];

			// 	polyline.push(this_step.start_location.lat + ", " + this_step.start_location.lng); 
			// 	polyline.push(this_step.end_location.lat + ", " + this_step.end_location.lng); 
			// }

			// straight_polyline[data.routes[0].legs[0].start_location.lng] = data.routes[0].legs[0].start_location.lat;
			// straight_polyline[data.routes[0].legs[0].end_location.lng] = data.routes[0].legs[0].end_location.lat;


			// var polypoints = (poly.decode(data.routes[0].overview_polyline.points));
			// for (var point in polypoints) {
			// 	polyline[polypoints[point][1]] = polypoints[point][0];
			// }

			// console.log(polyline);

			// plot({
			//     data:       { road: polyline, straight: straight_polyline },
			//     filename:   'output.png',
			//     style:      "line",
			//     xlabel:     "Longitude",
			//     ylabel: 	"Latitude"
			// });

			// console.log(maps.staticMap({
			// 	size: "1000x1000",
			// 	center: "53.3478,-6.2597",
			// 	zoom: 11,
			// 	path: [
			//     {
			//       color: '0x0000ff',
			//       weight: '5',
			//       points: polypoints
			//     }
			//   ]
			// }));
		});
	i++;
	}
}

setInterval(runCalcs, 150);
