'use strict';

var expect = require('chai').expect;
var express = require('express');
var ExpressiveRoute = require('../');
var DataTypes = ExpressiveRoute.plugins.validate.DataTypes;

describe('End to End', function() {

  var routes;

  before(function() {

    routes = new ExpressiveRoute(express);
    routes.plugin(ExpressiveRoute.plugins.validate);
    routes.route('/', function(router) {
      router.post('/users', {
        validate: {
          body: {
            name: {
              type: DataTypes.String
            },
            age: {
              type: DataTypes.Integer,
              optional: true
            }
          }
        },
        handler: function(req, res) {}
      });
    });
  });

  it('should returns proper routeTables', function() {
    var tables = routes.getRouteTables();

    expect(tables[0]).to.deep.equal({
      url: '/users',
      method: 'post',
      config: {
        handler: {},
        validate: {
          body: {
            name: {
              type: 'String'
            },
            age: {
              type: 'Integer',
              optional: true
            }
          }
        }
      }
    });
  });

});