'use strict';

var path = require('path');

module.exports = {

  join: function(...urls) {
    return path.join(...urls);
  }

};