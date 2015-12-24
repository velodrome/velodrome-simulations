# node-velodrome
A Node.js client for the Velodrome API

Install
=======
```bash
npm install velodrome
```

API Key
=======
API keys can be requested by emailing *[hi@velodro.me](mailto:hi@velodro.me)*.

API Documentation
=================
General API documentation is available on our developer portal at [https://velodrome.readme.io/](https://velodrome.readme.io/).

Authentication
==============
The Velodrome API utilises HTTP Basic Auth for authentication. Each user is issued with a public and private API key. The public key is used as the Basic Auth Username and the private key is used as the Basic Auth Password. Every request is completed over SSL and HTTP Strict Transport Security (HSTS) is enforced.

General Info
============
This API library is based on [mikeal](https://github.com/mikeal)'s *[request](https://github.com/request/request)* library. As such each API request calls the callback provided with three parameters (*error*, *resource*, *data*) as in the [*node-request*](https://github.com/request/request) library. More info can be found in the [*request* library documentation](https://github.com/request/request).

API keys are required for all requests.

Velodrome is currently only available in selected cities and orders can only be placed in **Dublin, Ireland**.

Usage
=====
Include and initialise the library like so:
```javascript
var velodrome = require("velodrome");
var api       = new velodrome("YOUR_PUBLIC_KEY", "YOUR_PRIVATE_KEY");
```

List Cities Example
===================
The following example shows how the Velodrome Node.js module could be used to list all cities Velodrome is available in.
```javascript
var velodrome = require("velodrome");
var api       = new velodrome("YOUR_PUBLIC_KEY", "YOUR_PRIVATE_KEY");

api.listCities(function (error, resource, data) {
	if (error) {
		throw error;
	} else {
		// data contains all the cities in a JS object
		console.log(data);
	}
});
```

Method List
===========
### Account
- [getAccount ( *callback* )](https://velodrome.readme.io/docs/my-account)

### Cities
- [listCities ( *callback* )](https://velodrome.readme.io/docs/list-cities)
- [getCity ( *city_id*, *callback* )](https://velodrome.readme.io/docs/get-city)

### Couriers
- [listCouriers ( *callback* )](https://velodrome.readme.io/docs/list-couriers-on-duty)

### Quotes
- [newQuote ( *options*, *callback* )](https://velodrome.readme.io/docs/request-quote)
- [listQuotes ( *callback* )](https://velodrome.readme.io/docs/list-quotes)
- [getQuote ( *quote_id*, *callback* )](https://velodrome.readme.io/docs/get-quote)

### Orders
- [newOrder ( *options*, *callback* )](https://velodrome.readme.io/docs/new-order)
- [listOrders ( *callback* )](https://velodrome.readme.io/docs/list-orders)
- [getOrder ( *order_id*, *callback* )](https://velodrome.readme.io/docs/get-order)

### Credit Cards
- [newCard ( *options*, *callback* )](https://velodrome.readme.io/docs/new-card)
- [listCards ( *callback* )](https://velodrome.readme.io/docs/list-cards)
- [getCard ( *card_id*, *callback* )](https://velodrome.readme.io/docs/get-card)
- [destroyCard ( *card_id*, *callback* )](https://velodrome.readme.io/docs/delete-card)
