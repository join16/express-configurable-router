'use strict';

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {

  isIn: function(arr, element) {
    var i = _.findIndex(arr, function(el) {
      return el === element;
    });
    
    return i >= 0;
  },

  promisifyArray: function(arr) {
    return _.map(arr, function(func) {
      return Promise.promisify(func);
    });
  }

};