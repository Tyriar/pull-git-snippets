'use strict';

var javaBlockExtractor = require('./java-block-extractor');

/**
 * A naive function for extracting a function from a chunk of javascript. This is currently a very
 * simple implementation that relies on indentation because I own the quality of the code in which
 * it's parsing.
 */
module.exports = function (code, functionName) {
  return javaBlockExtractor(code, 'function ' + functionName);
};
