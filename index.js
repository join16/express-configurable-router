'use strict';

var ExpressiveRoute = require('./lib/expressive-route');
var Plugin = require('./lib/plugin');
var validate = require('./lib/plugins/validate');
var authority = require('./lib/plugins/authority');

module.exports = ExpressiveRoute;
module.exports.Plugin = Plugin;

module.exports.plugins = {
  validate: validate,
  authority: authority
};