'use strict';

var blockExtractor = require('./block-extractor');
var chalk = require('chalk');

/**
 * Extractor a C# class via block-extractor and includes a documentation comment
 * for the class if it exists.
 */
module.exports = function (code, blockName) {
  var classBlock = blockExtractor(code, blockName);
  var classStartIndex = code.indexOf(classBlock);
  // Walk backwards from classStartIndex, attempt to find a '///'
  var beforeClassBlock = code.substring(0, classStartIndex);
  if (beforeClassBlock.replace(/\s/g, '').length === 0) {
    console.warn('W csharp-block-extractor: ' + blockName + ' is at beginning of file');
  }
  var lines = beforeClassBlock.split('\n');
  // Remove the last line as it's the class block matching line
  lines.splice(lines.length - 1);

  // Step up from the class and gather the documentation comment if it exists
  var documentationComment = [];
  for (var i = lines.length - 1; i >= 0; i--) {
    var docCommentStart = lines[i].search(/\/\/\//);
    if (docCommentStart === -1) {
      break;
    }
    documentationComment.unshift(lines[i]);
  }
  if (documentationComment.length > 0) {
      return documentationComment.join('\n') + '\n' + classBlock;
  }
  console.warn(chalk.yellow('W csharp-block-extractor: No documentation comment found for ' + blockName));
  return classBlock;
};
