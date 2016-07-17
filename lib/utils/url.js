'use strict';

var path = require('path');

module.exports = {

  join: function(...urls) {
    var url = path.join(...urls);

    return url.replace(/\/$/, '');
  }

};