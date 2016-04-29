'use strict';

var colors = require('colors');

module.exports = function (text) {
  console.error(colors.red(text));
};
