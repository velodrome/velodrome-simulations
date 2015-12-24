// Courier Signup and Save

var redis = require("redis"),
    client = redis.createClient();

var request = require("request");

var couriers = [];

var api_base = "https://localhost";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

for (var i = 0; i < 50; i++) {
	var courier_id = Math.ceil(Math.random() * 100000000000);
	var thisCourier = {
		"name": "Courier " + courier_id,
		"email": "courier.sim." + courier_id + "@velodro.me",
		"password": "sim",
		"phone": "+353862064608",
		"city": "dublin"
	};

	couriers.push(thisCourier);

	// Now create an account with this courier
	request.post(api_base + "/signup", {form: thisCourier}, function (err, res, data) {
		if (err) throw err;

		// Okay, now log this courier in
		request.post(api_base + "/login", {form: {
			email: thisCourier.email,
			password: thisCourier.password
		}}, function (err, res, data) {
			console.log(data);
		});
	});

	if (i === 49) {
		console.log(couriers);
		client.set("couriers/simulation", JSON.stringify(couriers));
	}
}