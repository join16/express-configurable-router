'use strict';

module.exports = {
  
  parseInt: function(val) {
    if (/^-?\d+$/.test(val)) {
      return parseInt(val);
    }
    return NaN;
  },

  /**
   * Returns strictly parsed float.
   * @param {string} val
   * @return {number}
   */
  parseFloat: function(val) {
    if (/^(\d*)+(\.\d+)?$/.test(val)) {
      return parseFloat(val);
    }
    return NaN;
  },

  /**
   * Returns parsed boolean from boolean value or boolean string
   * @param {string|boolean} value
   */
  parseBoolean: function(value) {
    if (_.isBoolean(value)) {
      return value;
    }

    return utils.isIn(value, ['true', '1', 1]);
  }
  
};