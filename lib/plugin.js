'use strict';

var utils = require('./utils');
var Constants = require('./constants');

/**
 * Plugin Constructor
 *
 * @param {Object} options
 * @param {String} options.key
 * @param {Function} [options.paramHandler] express param handler
 * @param {Function} [options.handler] express middleware style function
 * @constructor
 */
function Plugin(options) {
  this.key = options.key || null;
  this.handler = options.handler;
  this.paramHandler = null;
  
  if (utils._.isFunction(options.paramHandler)) {
    this.paramHandler = options.paramHandler;
  }
  if (utils.array.isIn(Constants.RESERVED_KEYS, this.key)) {
    throw new Error('key "' +  this.key + '" is reserved key');
  }
}

module.exports = Plugin;

Plugin.prototype.getPluginConfig = function(config) {
  return config[this.key] || null;
};

Plugin.prototype.getParamHandlerMiddleware = function(pluginConfig) {
  var paramHandler = this.paramHandler;
  
  if (!utils._.isFunction(paramHandler)) {
    return null;
  }
  
  return function(req, res, value) {
    return paramHandler(pluginConfig, req, res, value);
  };
};

Plugin.prototype.getHandlerMiddleware = function(pluginConfig) {
  var handler = this.handler;
  
  if (!utils._.isFunction(handler)) {
    return null;
  }
  
  return function(req, res, next) {
    handler(pluginConfig, req, res, next);
  };
};