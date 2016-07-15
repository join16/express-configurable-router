'use strict';

var _ = require('lodash');

module.exports = {

  isInstanceOf: function(instance, Class) {
    return _.isObject(instance) && _.isFunction(Class) && (instance instanceof Class);
  }

};