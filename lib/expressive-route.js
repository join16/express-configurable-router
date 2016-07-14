'use strict';

var Plugin = require('./plugin');
var Router = require('./router');
var utils = require('./utils');

/**
 * Constructor ExpressiveRoute
 *
 * @param {Function} express express module
 * @constructor
 */
function ExpressiveRoute(express) {
  this._express = express;
  this._plugins = [];
  this._router = null;
}

// exports `ExpressiveRoute`
module.exports = ExpressiveRoute;

/**
 * Registers plugin
 * 
 * @param {Plugin|Object} pluginParams either Plugin instance or plugin construct params
 */
ExpressiveRoute.prototype.plugin = function(pluginParams) {
  if (utils.class.isInstanceOf(pluginParams, Plugin)) {
    this._plugins.push(pluginParams);
    
  } else if (_.isObject(pluginParams)) {
    var plugin = new Plugin(pluginParams.options, pluginParams.handler);
    this._plugins.push(plugin);
    
  } else {
    throw new Error('invalid plugin params has passed');
  }
};

/**
 * Adds routes with passed routingFunction
 * 
 * Example)
 * ```js
 *   expressiveRoute.route('/', function(router) {
 *     router.get('/users', {});
 *   }); 
 * ```
 * 
 * @param {String} prefix
 * @param {Function} routingFunc router argument will be passed to routingFunc
 */
ExpressiveRoute.prototype.route = function(prefix, routingFunc) {
  if (!utils._.isNil(this._router)) {
    throw new Error('ExpressiveRoute.route has called twice!');
  }
  
  this._router = new Router({
    plugins: this._plugins,
    express: this._express,
    prefix: prefix
  });
  
  routingFunc(this._router);
};

ExpressiveRoute.prototype.getRouteTables = function() {
  if (utils._.isNil(this._router)) {
    return [];
  }

  return this._router.getRouteTables();
};