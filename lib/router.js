'use strict';

var methods = require('methods');

var Constants = require('./constants');
var utils = require('./utils');

/**
 * Router Constructor
 *
 * @param {Object} options
 * @constructor
 */
function Router(options) {
  this._plugins = options.plugins;
  this._express = options.express;
  this._prefix = options.prefix || '';
  this._defaultConfig = options.defaultConfig || {};
  this._expressRouter = this._express.Router();
  this._routeTables = [];
}

module.exports = Router;

utils._.forEach(methods, function(method) {
  Router.prototype[method] = function(url, config) {
    var actualUrl = utils.url.join(this._prefix, url);
    this._addRoute(actualUrl, method, config);
  };
});

Router.prototype.param = function(paramName, config) {
  var _config = utils._.merge({}, this._defaultConfig, config);
  var pluginParamHandlers = this._getPluginParamHandlers(_config);
  var handler = _config.handler;
  
  if (!utils._.isFunction(handler)) {
    throw new Error('missing config.handler for Router.param');
  }
  
  this._expressRouter.param(paramName, function(req, res, next, value) {
    utils._.forEach(pluginParamHandlers, function(paramHandler) {
      var parsedValue = paramHandler(req, res, paramName, value);
      if (!utils._.isUndefined(parsedValue)) {
        value = parsedValue;
      }
    });
    
    handler(req, res, next, value);
  });
};

Router.prototype.config = function(config) {
  utils._.merge(this._defaultConfig, config);
};

Router.prototype.getRouteTables = function() {
  var pluginParsers = {
    tableResults: {},
    comments: {}
  };
  
  utils._.forEach(this._plugins, function(plugin) {

    if (utils._.isFunction(plugin.routeTableResult)) {
      pluginParsers.tableResults[plugin.key] = plugin.routeTableResult;
    }
    if (utils._.isFunction(plugin.comments)) {
      pluginParsers.comments[plugin.key] = plugin.comments;
    }
  });
  
  var routeTables = utils._.cloneDeep(this._routeTables);
  
  return utils._.map(routeTables, function(routeTable) {
    var table = {
      url: routeTable.url,
      method: routeTable.method,
      config: {
        comments: []
      }
    };

    if (utils._.isString(routeTable.config.comment)) {
      table.config.comments.push(routeTable.config.comment);
    }
    
    utils._.forOwn(routeTable.config, function(value, key) {
      value = utils._.cloneDeep(value);
      
      if (pluginParsers.tableResults[key]) {
        table.config[key] = pluginParsers.tableResults[key](value);
      } else {
        table.config[key] = value;
      }

      if (pluginParsers.comments[key]) {
        var comments = pluginParsers.comments[key](value);
        if (!utils._.isArray(comments)) {
          comments = [comments];
        }
        
        table.config.comments = utils._.concat(table.config.comments, comments);
      }
    });
    
    return table;
  });
};

Router.prototype.route = function(prefix, routingFunc) {
  var childRouter = new Router({
    plugins: this._plugins,
    prefix: utils.url.join(this._prefix, prefix),
    express: this._express,
    defaultConfig: this._defaultConfig
  });

  routingFunc(childRouter);

  this._merge(childRouter);
};

Router.prototype._merge = function(router) {
  this._expressRouter.use(router._expressRouter);
  this._routeTables = utils._.concat(this._routeTables, router._routeTables);
};

Router.prototype._addRoute = function(url, method, config) {
  var _config = utils._.merge({}, this._defaultConfig, config);
  var args = [url];
  var pluginHandlers = this._getPluginHandlers(_config);
  
  args.push(...pluginHandlers);

  // add before handler
  if (utils._.isArray(_config.beforeHandler)) {
    args.push(_config.beforeHandler);
  }

  // add handler
  if (!utils._.isFunction(_config.handler)) {
    throw new Error('handler function required');
  }

  args.push(_config.handler);

  // add to express router
  this._expressRouter[method](...args);

  // add to routeTables
  this._routeTables.push({
    url: url,
    method: method,
    config: _config
  });
};

Router.prototype._getPluginParamHandlers = function(config) {
  var handlers = [];
  var keys = utils._.keys(config);
  
  utils._.forEach(this._plugins, function(plugin) {
    var pluginConfig = plugin.getPluginConfig(config);
    
    if (utils._.isNull(pluginConfig)) {
      return;
    }
    
    utils._.pull(keys, plugin.key);
    var middleware = plugin.getParamHandlerMiddleware(pluginConfig);
    
    if (utils._.isNull(middleware)) {
      return;
    }
    
    handlers.push(middleware);
  });

  // removes reserved keys
  utils._.pull(keys, ...Constants.NOT_ALLOWED_KEYS);

  // unexpected config keys exception
  if (keys.length > 0) {
    var keysStr = keys.join(', ');
    throw new Error('Unexpected config keys has passed: [' + keysStr + ']');
  }
  
  return handlers;
};

Router.prototype._getPluginHandlers = function(config) {
  var handlers = [];
  var keys = utils._.keys(config);
  
  utils._.forEach(this._plugins, function(plugin) {
    var pluginConfig = plugin.getPluginConfig(config);
    
    if (utils._.isNull(pluginConfig)) {
      return;
    }
    
    utils._.pull(keys, plugin.key);
    var middleware = plugin.getHandlerMiddleware(pluginConfig);
    
    if (utils._.isNull(middleware)) {
      return;
    }
    
    handlers.push(middleware);
  });

  // removes reserved keys
  utils._.pull(keys, ...Constants.NOT_ALLOWED_KEYS);

  // unexpected config keys exception
  if (keys.length > 0) {
    var keysStr = keys.join(', ');
    throw new Error('Unexpected config keys has passed: [' + keysStr + ']');
  }
  
  return handlers;
};