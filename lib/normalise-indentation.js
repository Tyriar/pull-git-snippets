'use strict';

function getStartingWhitespaceCount(line) {
  return /^\s*/.exec(line)[0].length;
}

function isLineWhitespaceOnly(line) {
  return line.match(/^\s*$/);
}

/**
 * Search through all lines, counting the minimum whitespace for non-whitespace-only lines.
 */
function getMinimumStartingWhitespaceCount(lines) {
  var minimumStartingWhitespace;
  lines.forEach(function (line) {
    if (!isLineWhitespaceOnly(line)) {
      var startingWhitespaceCount = getStartingWhitespaceCount(line);
      if (typeof minimumStartingWhitespace === 'undefined') {
        minimumStartingWhitespace = startingWhitespaceCount;
      } else {
        minimumStartingWhitespace = Math.min(minimumStartingWhitespace, startingWhitespaceCount);
      }
    }
  });
  return minimumStartingWhitespace;
}

function removeIndentation(lines, amount) {
  for (var i = 0; i < lines.length; i++) {
    if (!isLineWhitespaceOnly(lines[i])) {
      lines[i] = lines[i].substring(amount);
    }
  }
  return lines;
}

/**
 * Trim any extra indentation at the start of each code line.
 *
 * @param {String} code The code to normalise whitespace on.
 * @return {String} The code with whitespace normalised.
 */
module.exports = function(code) {
  var lines = code.split('\n');
  var minimumStartingWhitespace = getMinimumStartingWhitespaceCount(lines);
  lines = removeIndentation(lines, minimumStartingWhitespace);
  return lines.join('\n');
};
