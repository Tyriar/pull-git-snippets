'use strict';

var blockExtractor = require('./block-extractor');

/**
 * Extractors a Java class via block-extractor and includes a javadoc comment
 * for the class if it exists.
 */
module.exports = function(code, blockName) {
  var classBlock = blockExtractor(code, blockName);
  var classStartIndex = code.indexOf(classBlock);
  // Walk backwards from classStartIndex, attempt to find a '/**'
  var beforeClassBlock = code.substring(0, classStartIndex);
  if (beforeClassBlock.replace(/\s/g, '').length === 0) {
    console.warn('W base-java-block-extractor: ' + blockName + ' is at beginning of file');
  }
  var lines = beforeClassBlock.split('\n');
  // Remove the last line as it's the class block matching line
  lines.splice(lines.length - 1);
  for (var i = lines.length - 1; i >= 0; i--) {
    var javadocStart = lines[i].search(/\/\*\*/);
    if (javadocStart !== -1) {
      // Found the start of the closest comment to the class, step through each
      // line ensuring that the comment ends right before the class.
      lines.splice(0, i);
      for (var j = 0; j < lines.length - 1; j++) {
        if (lines[j].search(/\*\//) !== -1) {
          //console.warn('W Javadoc comment ended early for class ' + className + ' using javaClassExtractor');
          return classBlock;
        }
      }
      if (lines[lines.length - 1].search(/\*\/\s*$/) === -1) {
        console.warn('W base-java-block-extractor: Javadoc comment didn\'t end before ' + blockName);
        return classBlock;
      }
      classBlock = lines.join('\n') + '\n' + classBlock;
      return classBlock;
    }
  }
  console.warn('W base-java-block-extractor: No javadoc found for ' + blockName);
  return classBlock;
};
