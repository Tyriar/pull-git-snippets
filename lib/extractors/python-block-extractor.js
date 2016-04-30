'use strict';

var reportError = require('../report-error');

/**
 * A naive function for extracting a function from a chunk of javascript. This is currently a very
 * simple implementation that relies on indentation because I own the quality of the code in which
 * it's parsing.
 */
module.exports = function (code, blockMatcher) {
  var startIndex = code.indexOf(blockMatcher);
  if (startIndex === -1) {
    reportError('Failed to find extractor block "' + blockMatcher + '" in code: ' + code);
  }
  var codeStartTrimmed = code.substring(startIndex);
  var lines = codeStartTrimmed.split('\n');
  // Scan for next line with the <= indent level that contains content (or EOF)
  var functionIndentLevel = /^\s*/.exec(lines[0])[0];
  var lastLineWithContent = 0;
  for (var i = 1; i < lines.length; i++) {
    var lineIndentLevel = /^\s*/.exec(lines[i])[0];
    var hasContent = false;
    if (!lines[i].match(/^\s*$/)) {
      hasContent = true;
    }
    if (hasContent && lineIndentLevel.length === functionIndentLevel.length ||
        i === lines.length - 1) {
      if (i === lines.length - 1 &&
          lineIndentLevel.length > functionIndentLevel.length &&
          hasContent) {
        lastLineWithContent = i;
      }
      // This is where the function closes
      lines.splice(lastLineWithContent + 1);
      return lines.join('\n');
    }
    if (hasContent) {
      lastLineWithContent = i;
    }
  }
  reportError('Failed to extract block: ' + blockMatcher);
  reportError('From code: ' + code);
};
