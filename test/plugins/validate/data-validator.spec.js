'use strict';

var expect = require('chai').expect;
var _ = require('lodash');

var DataTypes = require('../../../lib/plugins/validate/data-types');
var dataValidator = require('../../../lib/plugins/validate/data-validator');

describe('plugins/validate/dataValidator', function() {

  var options = {
    validator: {
      isBetween: function(value, min, max) {
        return (value >= min) && (value <= max);
      },
      isNegative: function(value) {
        return value <= 0;
      }
    }
  };

  describe('#validateValue', function() {

    it('should success with single data', function() {
      var config = {
        type: DataTypes.Integer,
        validate: {
          isBetween: [-10, 30],
          NOT_isNegative: true
        }
      };

      expect(function() {
        dataValidator.validateValue(config, options, 'age', 'ddd');
      }).to.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'age', 40);
      }).to.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'age', -5);
      }).to.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'age', 15);
      }).to.not.throw(Error);

    });

    it('should success with array data', function() {
      var config = {
        type: DataTypes.Integer,
        multiple: true,
        validate: {
          isBetween: [-10, 30],
          NOT_isNegative: true
        }
      };

      expect(function() {
        dataValidator.validateValue(config, options, 'ages', [10, 20, 25]);
      }).to.not.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'ages', 10);
      }).to.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'ages', [10, 20, -5, 15]);
      }).to.throw(Error);
    });

    it('should success with object data', function() {
      var config = {
        object: true,
        format: {
          name: {
            type: DataTypes.String
          },
          age: {
            type: DataTypes.Integer,
            validate: {
              isBetween: [-10, 30],
              NOT_isNegative: true
            },
            optional: true
          }
        }
      };

      expect(function() {
        dataValidator.validateValue(config, options, 'user', {
          age: 10
        });
      }).to.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'user', {
          name: 'John',
          age: -5
        });
      }).to.throw(Error);
      expect(function() {
        dataValidator.validateValue(config, options, 'user', {
          name: 'John',
          age: 10
        });
      }).to.not.throw(Error);
      expect(function() {
        var result = dataValidator.validateValue(config, options, 'user', {
          name: 'John'
        });
        console.log(result);
        expect(result).to.not.have.property('age');
      }).to.not.throw(Error);
      expect(function() {
        var result = dataValidator.validateValue(config, options, 'user', {
          name: 'John',
          age: null
        });
        expect(result).to.not.have.property('age');
      }).to.not.throw(Error);
      expect(function() {
        var _config = _.cloneDeep(config);
        _config.format.age.acceptNull = true;
        var result = dataValidator.validateValue(_config, options, 'user', {
          name: 'John',
          age: null
        });
        expect(result).to.have.property('age').and.to.equal(null);
      }).to.not.throw(Error);
    });

  });

});