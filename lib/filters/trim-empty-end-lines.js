'use strict';

/**
 * Trims lines containing only whitespace at the end of the file.
 */
module.exports = function (code) {
  var lines = code.split('\n');
  while (lines.length && lines[lines.length - 1].match(/^\s*$/)) {
    lines.splice(lines.length - 1);
  }
  return lines.join('\n');
};
