'use strict';

/**
 * Remove any lines containing a 'use strict' statement.
 * @param {string} code The code block.
 */
module.exports = function(code, regex) {
  var lines = code.split('\n');
  lines = lines.filter(function (line) {
    return line.search(regex) === -1;
  });
  return lines.join('\n');
};
