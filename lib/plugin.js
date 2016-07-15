'use strict';

var utils = require('./utils');
var Constants = require('./constants');

/**
 * Plugin Constructor
 *
 * @param {Object} params
 * @param {String} params.key
 * @param {Object} [params.options]
 * @param {Function} [params.paramHandler] express param handler
 * @param {Function} [params.handler] express middleware style function
 * @param {Function} [params.routeTableResult] parser function for routeTableResult
 * @constructor
 */
function Plugin(params) {
  this.key = params.key || null;
  this.handler = params.handler;
  this.paramHandler = null;
  this.options = params.options || {};
  
  if (utils._.isFunction(params.routeTableResult)) {
    this.routeTableResult = params.routeTableResult;
  } else if (utils.array.isIn(Constants.RESERVED_KEYS, this.key)) {
    throw new Error('key "' + this.key + '" is reserved key so it requires routeTableResult');
  }
  if (utils._.isFunction(params.paramHandler)) {
    this.paramHandler = params.paramHandler.bind(this);
  }
  if (utils.array.isIn(Constants.NOT_ALLOWED_KEYS, this.key)) {
    throw new Error('key "' +  this.key + '" is not allowed key');
  }
}

module.exports = Plugin;

Plugin.prototype.addOptions = function(options) {
  utils._.assign(this.options, options);
};

Plugin.prototype.getPluginConfig = function(config) {
  return config[this.key] || null;
};

Plugin.prototype.getParamHandlerMiddleware = function(pluginConfig) {
  var paramHandler = this.paramHandler;
  var options = this.options;
  
  if (!utils._.isFunction(paramHandler)) {
    return null;
  }
  
  return function(req, res, value) {
    return paramHandler(pluginConfig, options, req, res, value);
  };
};

Plugin.prototype.getHandlerMiddleware = function(pluginConfig) {
  var handler = this.handler;
  var options = this.options;
  
  if (!utils._.isFunction(handler)) {
    return null;
  }
  
  return function(req, res, next) {
    handler(pluginConfig, options, req, res, next);
  };
};