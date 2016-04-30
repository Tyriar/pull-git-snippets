'use strict';

var javaBlockExtractor = require('./java-block-extractor');

/**
 * Extractors a Java class via block-extractor and includes a javadoc comment
 * for the class if it exists.
 */
module.exports = function (code, className) {
  return javaBlockExtractor(code, 'class ' + className);
};
