'use strict';

var express = require('express');
var expect = require('chai').expect;

var ExpressiveRoute = require('../');

describe('expressiveRoute', function() {

  var routes;

  beforeEach(function() {
    routes = new ExpressiveRoute(express);
  });

  describe('#plugin', function() {
    it('adds plugin', function() {
      routes.plugin(ExpressiveRoute.plugins.validate);
    });
  });

  describe('#route', function() {
    it('calls route registering function', function() {
      routes.route('/', function(router) {

      });
    });
  });

  describe('#getRouteTables', function() {
    it('returns routeTables', function() {
      routes.route('/', function(router) {
        router.get('/users', {
          handler: function(req, res, next) {}
        });
      });

      expect(routes.getRouteTables()).to.have.length(1);
    });
  });

});