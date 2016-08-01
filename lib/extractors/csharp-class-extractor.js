'use strict';

var csharpBlockExtractor = require('./csharp-block-extractor');

/**
 * Extractor a C# class via block-extractor and includes a documentation comment
 * for the class if it exists.
 */
module.exports = function (code, className) {
  return csharpBlockExtractor(code, 'class ' + className);
};
