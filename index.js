'use strict';

var ExpressiveRoute = require('./lib/expressive-route');
var Plugin = require('./lib/plugin');
var validate = require('./lib/plugins/validate');

module.exports = ExpressiveRoute;
module.exports.Plugin = Plugin;

module.exports.plugins = {
  validate: validate
};