'use strict';

var expect = require('chai').expect;

var util = require('util');
var utils = require('../lib/utils');

describe('utils', function() {

  describe('.array', function() {

    describe('#isIn', function() {
      var arr = [1, 2, 3, 4];

      it('returns whether if given element is in array', function() {
        expect(utils.array.isIn(arr, 3)).to.equal(true);
        expect(utils.array.isIn(arr, 10)).to.equal(false);
      });
    });

  });

  describe('.class', function() {
    describe('#isInstanceOf', function() {

      function CustomError() {
        Error.call(this);
      }
      util.inherits(CustomError, Error);

      it('returns whether given element is instance of Class', function() {
        expect(utils.class.isInstanceOf(new Error(), Error)).to.equal(true);
        expect(utils.class.isInstanceOf({}, Error)).to.equal(false);
        expect(utils.class.isInstanceOf(new CustomError(), Error)).to.equal(true);
      });
    });
  });

  describe('.url', function() {
    describe('#join', function() {
      it('merges url segments into one', function() {
        expect(utils.url.join('/api', '/users', '/:id')).to.equal('/api/users/:id');
      });
    });
  });

});