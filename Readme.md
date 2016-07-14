
# Expressive Route

express configurable route manager with extendable plugin systems

### Installation

```bash
$ npm install expressive-route
```

### Usage

```js

var express = require('express');
var ExpressiveRoute = require('expressive-route');

var app = express();
var expressiveRoute = new ExpressiveRoute(express);

expressiveRoute.route(function(router) {
	router.get('/users', {
		handler: function(req, res, next) {}
	});
});

app.use(expressiveRoute.router);

```

### Principle

This module is made for configurable router system.
by calling router.METHOD function with url and route configuration object,
It tells that router will use plugin middlewares with given configuration and handler.
