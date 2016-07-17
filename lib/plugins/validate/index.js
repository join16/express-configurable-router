'use strict';

var utils = require('../../utils');
var dataValidator = require('./data-validator');
var DataTypes = require('./data-types');
var errors = require('./errors');
var routeTableResultHandler = require('./route-table-result-handler');

exports.key = 'validate';

exports.paramHandler = function(config, options, req, res, key, value) {
  return dataValidator.validateValue(config, options, key, value);
};

exports.handler = function(config, options, req, res, next) {
  var queryKey = options.query || 'query';
  var bodyKey = options.body || 'body';
  
  req[queryKey] = dataValidator.validateValue({
    object: true,
    format: config.query || {}
  }, options, 'query', req.query);
  
  req[bodyKey] = dataValidator.validateValue({
    object: true,
    format: config.body || {}
  }, options, 'body', req.body);
  
  next();
};

exports.routeTableResult = function(config) {
  var result = {};
  var options = this.options;

  if (utils._.isObject(config.body)) {
    result.body = routeTableResultHandler.getRouteTableResult(options, {
      object: true,
      format: config.body
    });
  }
  if (utils._.isObject(config.query)) {
    result.query = routeTableResultHandler.getRouteTableResult(options, {
      object: true,
      format: config.query
    });
  }

  return result;
};

///// additional exports for development
exports.DataTypes = DataTypes;
exports.errors = errors;