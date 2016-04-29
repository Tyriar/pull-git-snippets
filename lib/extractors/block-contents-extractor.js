'use strict';

var reportError = require('../report-error');

module.exports = function(code, blockMatcher) {
  var startTerm = blockMatcher;
  var startIndex = code.indexOf(startTerm);
  if (startIndex === -1) {
    reportError('Failed to find extractor term "' + startTerm + '" in code: ' + code);
  }
  var codeStartTrimmed = code.substring(startIndex);
  var lines = codeStartTrimmed.split('\n');
  // Scan for next line with the same indent level
  var functionIndentLevel = /^\s*/.exec(lines[0])[0];
  // Remove the first line as it's part of the wrapping block
  lines = lines.slice(1);
  for (var i = 1; i < lines.length; i++) {
    var lineIndentLevel = /^\s*/.exec(lines[i])[0];
    // If the indent is the same and the line is not just whitespace
    if (lineIndentLevel.length === functionIndentLevel.length && !lines[i].match(/^\s*$/)) {
      // This is where the function closes, remove from lines including the matching line as it's
      // the end of the block
      lines.splice(i);
      return lines.join('\n');
    }
  }
  reportError('Failed to extract block contents: ' + blockMatcher);
  reportError('From code: ' + code);
};
