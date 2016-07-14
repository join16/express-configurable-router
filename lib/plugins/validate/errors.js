'use strict';

var util = require('util');

module.exports = {
  ValidationError: ValidationError,
  InvalidTypeError: InvalidTypeError
};

/**
 * Constructor ValidationError
 * @constructor
 */
function ValidationError(name, value, reason) {
  Error.call(this);
  this.name = name;
  this.value = value;
  this.reason = reason;
}
util.inherits(ValidationError, Error);

/**
 * InvalidTypeError Constructor
 * @constructor
 */
function InvalidTypeError(name, value) {
  ValidationError.call(this, name, value, 'InvalidType');
}
util.inherits(InvalidTypeError, ValidationError);