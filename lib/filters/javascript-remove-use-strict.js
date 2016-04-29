'use strict';

var removeLinesMatchingRegex = require('./common/remove-lines-matching-regex');

/**
 * Remove any lines containing a 'use strict' statement.
 * @param {string} code The code block.
 */
module.exports = function(code) {
  return removeLinesMatchingRegex(code, /\s*("|')use strict("|');?\s*/);
};
