'use strict';

var util = require('util');

var utils = require('../../utils');

exports.key = 'authority';

exports.handler = function(config, options, req, res, next) {
  var currentAuthority = req[options.authorityKey];
  
  // allowed to all
  if (config === '*') {
    return next();
  }
  
  if (!utils._.isArray(config)) {
    config = [config];
  }
  if (utils.array.isIn(config, currentAuthority)) {
    return next();
  }
  if (utils._.isFunction(options.onError)) {
    return options.onError(config, currentAuthority, next);
  }

  throw new AuthorityError(config, currentAuthority);
};

exports.routeTableResult = function(config) {
  return utils._.isArray(config) ?
    config.join(', ') :
    config;
};

exports.options = {
  authorityKey: 'authority'
};

exports.AuthorityError = AuthorityError;

/**
 * Authority Error
 *
 * @constructor
 */
function AuthorityError(requiredAuthorities, currentAuthority) {
  Error.call(this);
  this.required = requiredAuthorities;
  this.current = currentAuthority;
  this.status = 403;
  this.message = 'Not Allowed Authority';
};
util.inherits(AuthorityError, Error);