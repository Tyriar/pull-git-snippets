'use strict';

var chalk = require('chalk');

module.exports = function (text) {
  console.error(chalk.red(text));
};
