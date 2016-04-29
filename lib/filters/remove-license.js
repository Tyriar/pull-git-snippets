'use strict';

/**
 * Remove the first comment containing 'license' from the file, report an error
 * if it doesn't exist.
 */
module.exports = function(code) {
  // TODO: Make language agnostic by leveraging comment definitions in
  // create-language-comment.js
  var commentStart = '/*';
  var commentEnd = '*/';
  var searchRegexTerm = /license/i;
  for (var i = 0; i < code.length - (commentStart.length - 1); i++) {
    if (code.substring(i, i + 2) !== commentStart) {
      continue;
    }
    // scan for next */
    for (var j = (i + commentStart.length); j < (code.length - commentEnd.length); j++) {
      if (code.substring(j, j + 2) !== commentEnd) {
        continue;
      }
      // Comment found, search for searchTerm
      var comment = code.substring(i, j + commentEnd.length);
      if (comment.search(searchRegexTerm) >= 0) {
        // Remove entire comment
        var commentStartIndex = i;
        // Assume unix line endings
        while (commentStartIndex > 0 && code[commentStartIndex - 1] !== '\n') {
          commentStartIndex--;
        }
        // Assume not the end of the line
        var commentEndIndex = code.indexOf('\n', j) + 1;
        code = code.slice(0, commentStartIndex) + code.slice(commentEndIndex);
        return code;
      }
      // No match found, continue to next comment
    }
  }
  return code;
};
