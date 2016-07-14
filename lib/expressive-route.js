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
  this.router = null;
}

// exports `ExpressiveRoute`
module.exports = ExpressiveRoute;

/**
 * Registers plugin
 * 
 * @param {Plugin|Object} pluginParams either Plugin instance or plugin construct params
 * @param {Object} [options]
 */
ExpressiveRoute.prototype.plugin = function(pluginParams, options) {
  options = options || {};
  
  var plugin;
  
  if (utils.class.isInstanceOf(pluginParams, Plugin)) {
    plugin = pluginParams;
    
  } else if (_.isObject(pluginParams)) {
    plugin = new Plugin({
      options: pluginParams.options,
      handler: pluginParams.handler
    });
    
  } else {
    throw new Error('invalid plugin params has passed');
  }
  
  plugin.addOptions(options);
  this._plugins.push(options);
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
  if (!utils._.isNil(this.router)) {
    throw new Error('ExpressiveRoute.route has called twice!');
  }
  
  this.router = new Router({
    plugins: this._plugins,
    express: this._express,
    prefix: prefix
  });
  
  routingFunc(this.router);
};

ExpressiveRoute.prototype.getRouteTables = function() {
  if (utils._.isNil(this.router)) {
    return [];
  }

  return this.router.getRouteTables();
};