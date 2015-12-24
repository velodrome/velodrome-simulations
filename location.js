// Courier Signup and Save

var redis = require("redis"),
client = redis.createClient();

var request = require("request");

var gpxParse = require("gpx-parse");

var velodrome = require("velodrome");
var courier   = new velodrome("O8BSqgq1KPGRAHWMiOLWsZbczpllum3T", "qun25y1odny9fhOPzwLtHtTXbFVgO3IW")

var api_base = "https://localhost";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var journey_time = 2;
var i = 0;

gpxParse.parseGpxFromFile("gpx/office-rds.gpx", function(error, data) {
  var segments = data.tracks[0].segments[0];

  var interval = (((journey_time * 60) / (segments.length)) * 1000) * 2;
  console.log(segments.length);
  console.log(interval);
  function looper() {
    if (i < segments.length) {
      var segment = segments[i];

      courier.sendRequest("POST", "/courier/location", function (err, res, data) {
        console.log(data);
      }, {
        latitude: segment.lat,
        longitude: segment.lon
      });
    } else {
      clearInterval(timer);
    }

    i++;

    setTimeout(looper, interval);
  }

  looper();
});