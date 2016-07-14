'use strict';

var expect = require('chai').expect;

var Plugin = require('../lib/plugin');

describe('Plugin', function() {

  describe('#constructor', function() {
    it('creates plugin instance', function() {
      expect(new Plugin({
        key: 'example'
      })).to.be.an.instanceof(Plugin);
    });
    it('throws an error if reserved key has passed', function() {
      expect(function() {
        new Plugin({
          key: 'handler'
        });
      }).to.throw(Error);
    });
  });

  describe('#getPluginConfig', function() {
    var plugin = new Plugin({ key: 'example2' });

    it('returns config for plugin', function() {
      var config = {
        example1: {
          name: 'ex1'
        },
        example2: {
          name: 'ex2'
        }
      };

      expect(plugin.getPluginConfig(config)).to.deep.equal({
        name: 'ex2'
      });
    });
    it('returns null if no config for plugin exists', function() {
      var config = {
        example1: {
          name: 'ex1'
        },
        example233: {
          name: 'ex3'
        }
      };

      expect(plugin.getPluginConfig(config)).to.equal(null);
    });

  });

  describe('#getHandlerMiddleware', function() {
    it('returns express style middleware function', function() {
      var plugin = new Plugin({
        key: 'example',
        handler: function(config, req, res, next) {
        }
      });

      expect(plugin.getHandlerMiddleware()).to.have.length(3);
    });
    it('returns null if no handler has registered', function() {
      var plugin = new Plugin({ key: 'example' });
      expect(plugin.getHandlerMiddleware()).to.equal(null);
    });
  });

});