'use strict';

var reportError = require('../report-error');

/**
 * Extractors a Java class via block-extractor and includes a javadoc comment
 * for the class if it exists.
 */
module.exports = function (code, moduleName) {
  var startTerm = 'module ' + moduleName;
  var startIndex = code.indexOf(startTerm);
  if (startIndex === -1) {
    reportError('Failed to find extractor term "' + startTerm + '" in code: ' + code);
  }
  // Scan backwards to find the first '\n' before startIndex and reassign
  while (startIndex > 0 && code[startIndex - 1] !== '\n') {
    startIndex--;
  }
  var codeStartTrimmed = code.substring(startIndex);
  var lines = codeStartTrimmed.split('\n');
  // Scan for next line with the same indent level
  var functionIndentLevel = /^\s*/.exec(lines[0])[0];
  for (var i = 1; i < lines.length; i++) {
    if (i === 1 && lines[i].match(/^\s*\{\s*$/)) {
      // Special case for C#/Java
      continue;
    }
    var lineIndentLevel = /^\s*/.exec(lines[i])[0];
    // If the indent is the same and the line is not just whitespace
    if (lineIndentLevel.length === functionIndentLevel.length && !lines[i].match(/^\s*$/) &&
        !lines[i].match(/^\s*(private|protected|public)\s*$/)) {
      // This is where the function closes, remove from lines
      lines.splice(i + 1);
      return lines.join('\n');
    }
  }
  reportError('Failed to extract ruby module: ' + moduleName);
  reportError('From code: ' + code);
};
