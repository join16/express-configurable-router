'use strict';

var dataValidator = require('./data-validator');
var DataTypes = require('./data-types');
var errors = require('./errors');

exports.key = 'validate';

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


///// additional exports for development
exports.DataTypes = DataTypes;
exports.errors = errors;