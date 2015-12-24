// Read through the reticulation trial results and plot a graph of the points
var plot = require("plotter").plot;
var fs   = require("fs");

var locations = {};

fs.readFile("reticulation.json", "utf8", function (err, data) {
	data = JSON.parse(data);

	// Simply plot all the random points generated
	for (var trial in data) {
		var this_trial = data[trial];

		locations[this_trial.origin[1]] = this_trial.origin[0];
		locations[this_trial.destination[1]] = this_trial.destination[0];
	}

	plot({
	    data:       { locations:locations },
	    filename:   "locations.svg",
	    format:     "svg",
		title: 		"Dublin Reticulation Trial Random Location Points",
	    style:      "points",
	    xlabel:     "Longitude",
	    ylabel: 	"Latitude"
	});
});