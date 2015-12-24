/*
 *   ___      ___ _______   ___       ________  ________  ________  ________  _____ ______   _______
 *  |\  \    /  /|\  ___ \ |\  \     |\   __  \|\   ___ \|\   __  \|\   __  \|\   _ \  _   \|\  ___ \
 *  \ \  \  /  / | \   __/|\ \  \    \ \  \|\  \ \  \_|\ \ \  \|\  \ \  \|\  \ \  \\\__\ \  \ \   __/|
 *   \ \  \/  / / \ \  \_|/_\ \  \    \ \  \\\  \ \  \ \\ \ \   _  _\ \  \\\  \ \  \\|__| \  \ \  \_|/__
 *    \ \    / /   \ \  \_|\ \ \  \____\ \  \\\  \ \  \_\\ \ \  \\  \\ \  \\\  \ \  \    \ \  \ \  \_|\ \
 *     \ \__/ /     \ \_______\ \_______\ \_______\ \_______\ \__\\ _\\ \_______\ \__\    \ \__\ \_______\
 *      \|__|/       \|_______|\|_______|\|_______|\|_______|\|__|\|__|\|_______|\|__|     \|__|\|_______|
 *
 */

var request = require("request");

function Velodrome(public_key, private_key) {
  this.config = {
    api: {
      api_protocol: "https://",
      api_host: "api.velodro.me",
      api_base_url: "",
      keys: {
        public_key: public_key,
        private_key: private_key
      },
      auth_token: "Basic " + new Buffer(public_key + ":" + private_key).toString("base64")
    }
  }

  request.get({
    "uri": this.buildUrl("/account"),
    headers: {
      "Content-Type": "application/json"
    }
  }, function (error, response, data) {
    if (error) {
      throw error;
    } else if (response.code == 200 && data && data !== "Unauthorized") {
      // All good
    } else if (data && data === "Unauthorized") {
      throw new Error("Invalid credentials");
    }
  });
}

Velodrome.prototype.buildUrl = function (route) {
  return this.config.api.api_protocol + this.config.api.keys.public_key + ":" + this.config.api.keys.private_key + "@" + this.config.api.api_host + this.config.api.api_base_url + route;
};

Velodrome.prototype.sendRequest = function (method, route, callback, fields) {
  // Build a URL
  var url = this.buildUrl(route);

  var options = {
    "method": method,
    "uri": url,
    headers: {
       "Content-Type": "application/json",
       "Authorization": this.config.api.auth_token
    }
  };

  if (method === "POST") {
    options.form = fields;
  }

  request(options, function (error, response, data) {
    // Ternary operators are bad
    callback(error, response, (JSON.parse(data) ? JSON.parse(data) : data));
    //                                          ^                  ^
  });
}

Velodrome.prototype.echo = function () {
  return this;
}

Velodrome.prototype.getAccount = function (callback) {
  // Fetch the user's account
  this.sendRequest("GET", "/account", callback);
}

Velodrome.prototype.listCities = function (callback) {
  // Fetch the list of cities
  this.sendRequest("GET", "/cities", callback);
}

Velodrome.prototype.getCity = function (city_id, callback) {
  // Fetch this individual city
  this.sendRequest("GET", "/cities/" + city_id, callback);
}

Velodrome.prototype.listCouriers = function (callback) {
  // List all the available couriers
  this.sendRequest("GET", "/couriers", callback);
}

Velodrome.prototype.newQuote = function (options, callback) {
  // Create a new quote based on the parameters set
  this.sendRequest("POST", "/customer/quotes", callback, options);
}

Velodrome.prototype.listQuotes = function (callback) {
  // Fetch the list of a customer's quotes and return them
  this.sendRequest("GET", "/customer/quotes", callback);
}

Velodrome.prototype.getQuote = function (quote_id, callback) {
  // Fetch a particular quote based on an ID
  this.sendRequest("GET", "/customer/quotes/" + quote_id, callback);
}

Velodrome.prototype.newOrder = function (options, callback) {
  // Create a new order based on the parameters set
  this.sendRequest("POST", "/customer/orders", callback, options);
}

Velodrome.prototype.listOrders = function (callback) {
  // Fetch all the orders this user placed
  this.sendRequest("GET", "/customer/orders", callback);
}

Velodrome.prototype.getOrder = function (order_id, callback) {
  // Fetch this individual order
  this.sendRequest("GET", "/customer/orders/" + order_id, callback);
}

Velodrome.prototype.newCard = function (options, callback) {
  // Remove a card from a user's account
  this.sendRequest("POST", "/customer/cards", callback, options);
}

Velodrome.prototype.listCards = function (callback) {
  // Fetch the list of a user's linked credit cards
  this.sendRequest("GET", "/customer/cards", callback);
}

Velodrome.prototype.getCard = function (card_id, callback) {
  // Fetch a particular credit card from a user's account
  this.sendRequest("GET", "/customer/cards/" + card_id, callback);
}

Velodrome.prototype.destroyCard = function (card_id, callback) {
  // Remove a card from a user's account
  this.sendRequest("POST", "/customer/cards/" + card_id + "/destroy", callback);
}

module.exports = Velodrome;