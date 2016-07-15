'use strict';

var expect = require('chai').expect;
var _ = require('lodash');

var Plugin = require('../../../lib/plugin');
var DataTypes = require('../../../lib/plugins/validate/data-types');
var validateParams = require('../../../lib/plugins/validate');

var validator = {
  isBetween: function(value, min, max) {
    return (value >= min) && (value <= max);
  },
  isNegative: function(value) {
    return value <= 0;
  },
  even: function(value) {}
};

validator.isBetween.comment = function(min, max) {
  return min + ' <= value <= ' + max;
};
validator.isNegative.comment = 'positive number';

describe('plugins/validate', function() {

  var plugin = new Plugin(validateParams);
  plugin.addOptions({
    validator: validator
  });
  var config = {
    body: {
      user: {
        object: true,
        format: {
          name: {
            type: DataTypes.String
          },
          age: {
            type: DataTypes.Integer,
            validate: {
              isBetween: [-10, 30],
              NOT_isNegative: true,
              even: true
            },
            optional: true
          }
        }
      }
    }
  };

  describe('#routeTableResult', function() {
    it('generates routeTableResult', function() {
      expect(plugin.routeTableResult(config)).to.deep.equal({
        body: {
          user: {
            type: 'Object',
            schema: {
              name: {
                type: 'String'
              },
              age: {
                type: 'Integer',
                optional: true,
                spec: [
                  '-10 <= value <= 30',
                  'positive number',
                  'even'
                ]
              }
            }
          }
        }
      });
    });
  });
  
});