'use strict';

var expect = require('chai').expect;
var express = require('express');

var Plugin = require('../lib/plugin');
var Router = require('../lib/router');

describe('router', function() {

  var plugins;
  var router;

  beforeEach(function() {
    plugins = [new Plugin({
      key: 'example1'
    }), new Plugin({
      key: 'example2',
      paramHandler: function ex2ParamHandler(config, options, req, res, value) {
        if (config.parse) {
          return parseInt(value);
        }
      },
      handler: function ex2Handler(config, options, req, res, next) {
        next();
      }
    })];

    router = new Router({
      express: express,
      prefix: '/api',
      plugins: plugins
    });
  });

  describe('#config', function() {
    it('assigns defaultConfig', function() {
      router.config({
        example1: {
          name: 'ex1'
        }
      });

      expect(router._defaultConfig).to.deep.equal({
        example1: {
          name: 'ex1'
        }
      });
    });
  });

  describe('#_addRoute', function() {
    it('adds routing function to express router and adds entry in routeTables', function() {
      router._addRoute('/users', 'get', {
        example2: {
          name: 'ex2'
        },
        handler: function mainHandler(req, res, next) {
          next();
        }
      });

      expect(router._routeTables).to.have.length(1);
      expect(router._routeTables[0].url).to.equal('/users');
      expect(router._routeTables[0].method).to.equal('get');
      expect(router._routeTables[0].config).to.be.a('object');

      var routerStack = router._expressRouter.stack[0].route.stack;

      expect(routerStack).to.have.length(2);
      expect(routerStack[1].handle.name).to.equal('mainHandler');
    });
    it('skips adding plugin handler if no config for plugin has passed', function() {
      router._addRoute('/users', 'get', {
        handler: function mainHandler(req, res, next) {
          next();
        }
      });

      expect(router._routeTables).to.have.length(1);
      expect(router._routeTables[0].url).to.equal('/users');
      expect(router._routeTables[0].method).to.equal('get');
      expect(router._routeTables[0].config).to.be.a('object');

      var routerStack = router._expressRouter.stack[0].route.stack;

      expect(routerStack).to.have.length(1);
      expect(routerStack[0].handle.name).to.equal('mainHandler');
    });
  });

  describe('#param', function() {

    it('adds param handler for express router', function() {
      var req = {};
      var res = {};
      var next = function() {};
      var value = '100';

      router.param('userId', {
        example2: {
          name: 'ex2',
          parse: true
        },
        handler: function(req, res, next, value) {
          expect(value).to.equal(100);
          next();
        }
      });

      var paramRouterFunction = router._expressRouter.params.userId[0];

      paramRouterFunction(req, res, next, value);
    });
    it('not parses param value if plugin handler returns undefined', function() {
      var req = {};
      var res = {};
      var next = function() {};
      var value = '100';

      router.param('userId', {
        example2: {
          name: 'ex2'
        },
        handler: function(req, res, next, value) {
          expect(value).to.equal('100');
          next();
        }
      });

      var paramRouterFunction = router._expressRouter.params.userId[0];

      paramRouterFunction(req, res, next, value);
    });

  });
  
});