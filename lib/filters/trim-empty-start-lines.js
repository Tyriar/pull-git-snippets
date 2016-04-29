'use strict';

/**
 * Trims lines containing only whitespace at the start of the file.
 */
module.exports = function(code) {
  var lines = code.split('\n');
  while (lines.length && lines[0].match(/^\s*$/)) {
    lines.splice(0, 1);
  }
  return lines.join('\n');
};
