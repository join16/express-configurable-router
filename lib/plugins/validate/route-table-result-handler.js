'use strict';

var utils = require('../../utils');

module.exports = {
  getRouteTableResult: getRouteTableResult
};

////

function getRouteTableResult(options, config) {
  var result = {};

  if (config.multiple) {
    result.multiple = true;
  }
  if (config.optional) {
    result.optional = true;
  }
  if (utils._.isString(config.comment)) {
    result.comment = config.comment;
  }
  if (utils._.isObject(config.type)) {
    result.type = config.type.name;
  }
  
  if (utils._.isObject(config.validate)) {
    var spec = [];
    var validator = options.validator;
    
    utils._.forOwn(config.validate, function(args, name) {
      var description = '';

      if (/^NOT\_.*$/.test(name)) {
        description += 'NOT ';
        name = name.replace('NOT_', '');
      }
      if (args === true) {
        args = [];
      }

      var func = validator[name];
      
      if (utils._.isString(func.comment)) {
        description = func.comment;
      } else if (utils._.isFunction(func.comment)) {
        description = func.comment(...args);
      } else {
        description = name;

        if (args.length > 0) {
          description += '(' + args.join(', ') + ')';
        }
      }
      
      spec.push(description);
    });

    result.spec = spec;
  }
  
  if (config.object === true) {
    result.type = 'Object';
    result.schema = {};
    utils._.forOwn(config.format, function(value, key) {
      result.schema[key] = getRouteTableResult(options, value);
    });
  }
  
  return result;
}