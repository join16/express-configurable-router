'use strict';

var moment = require('moment');

var utils = require('../../utils');

module.exports = {

  // default data types. no action
  String: {
    name: 'String',
    validate: function(value) {
      return utils._.isString(value);
    },
    parse: null

  },

  // integer input. parsed into number
  Integer: {
    name: 'Integer',
    validate: function(value) {
      return !isNaN(utils.validate.parseInt(value));
    },
    parse: function(value) {
      return utils.validate.parseInt(value);
    }
  },

  Float: {
    name: 'Float',
    validate: function(value) {
      return !isNaN(utils.validate.parseFloat(value));
    },
    parse: function(value) {
      return utils.validate.parseFloat(value);
    }
  },

  Boolean: {
    name: 'Boolean',
    validate: function(value) {
      return utils.array.isIn([true, false, '0', '1', 'true', 'false', 0, 1], value);
    },
    parse: function(value) {
      return utils.validate.parseBoolean(value);
    }
  },

  Date: {
    name: 'Date',
    validate: function(value) {
      if (!utils._.isString(value)) {
        return false;
      }
      if (isNaN(Date.parse(value))) {
        return false;
      }

      return moment(value).isValid();
    },
    parse: function(value) {
      return moment(value).utc().toDate();
    }
  }

};