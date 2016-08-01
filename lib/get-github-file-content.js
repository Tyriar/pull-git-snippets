'use strict';

var Promise = require('es6-promise').Promise;
var requireDir = require('require-dir');

var createLanguageComment = require('./create-language-comment');
var normaliseIndentation = require('./normalise-indentation');
var filters = requireDir('./filters');

var blockContentsExtractor = require('./extractors/block-contents-extractor');
var blockExtractor = require('./extractors/block-extractor');
var csharpBlockExtractor = require('./extractors/csharp-block-extractor');
var csharpClassExtractor = require('./extractors/csharp-class-extractor');
var javaBlockExtractor = require('./extractors/java-block-extractor');
var javaClassExtractor = require('./extractors/java-class-extractor');
var javaInterfaceExtractor = require('./extractors/java-interface-extractor');
var javascriptFunctionExtractor = require('./extractors/javascript-function-extractor');
var pythonBlockExtractor = require('./extractors/python-block-extractor');
var rubyModuleExtractor = require('./extractors/ruby-module-extractor');

function getExtractorObject(extractor) {
  switch (extractor) {
    case 'blockContentsExtractor': return blockContentsExtractor;
    case 'blockExtractor': return blockExtractor;
    case 'csharpBlockExtractor': return csharpBlockExtractor;
    case 'csharpClassExtractor': return csharpClassExtractor;
    case 'javaBlockExtractor': return javaBlockExtractor;
    case 'javaClassExtractor': return javaClassExtractor;
    case 'javaInterfaceExtractor': return javaInterfaceExtractor;
    case 'javascriptFunctionExtractor': return javascriptFunctionExtractor;
    case 'pythonBlockExtractor': return pythonBlockExtractor;
    case 'rubyModuleExtractor': return rubyModuleExtractor;
    default:
      if (extractor !== undefined) {
        throw new Error('No extractor matching ' + extractor);
      }
      return undefined;
  }
}

function getExtension(path) {
  return path.substring(path.lastIndexOf('.') + 1);
}

function removeWindowsLineEndings(text) {
  return text.replace(/(\r\n|\n|\r)/gm, '\n');
}

module.exports = function (github, user, repository, branch, path) {
  return new Promise(function (resolve, reject) {
    var repo = github.getRepo(user, repository);
    var filePath = typeof path === 'string' ? path : path.file;
    repo.read(branch, filePath, function (err, contents) {
      if (err) {
        reject();
        throw new Error('Error retrieving file contents:\n' +
              '  repository: ' + user + '/' + repository + '@' + branch + '\n' +
              '  repository path: ' + filePath + '\n' +
              '  request path: ' + err.path + '\n' +
              '  error code: ' + err.error + '\n' +
              (err.request ? '  response text: ' + err.request.responseText : ''));
      }
      // Remove Windows line endings, some files require these endings (.cs)
      var fileContents = removeWindowsLineEndings(contents);
      if (typeof path === 'object') {
        var extractor = getExtractorObject(path.extractor);
        if (extractor) {
          fileContents = extractor(fileContents, path.extractorValue);
          fileContents = normaliseIndentation(fileContents);
        }
        if (path.addFileComment) {
          var commentText = 'file: ' + path.file.substring(path.file.lastIndexOf('/') + 1);
          var comment = createLanguageComment.byExtension(commentText, getExtension(path.file));
          fileContents = comment + '\n\n' + fileContents;
        }
        if (path.filters) {
          path.filters.forEach(function (filter) {
            if (!(filter in filters)) {
              throw new Error('Unexpected filter "' + filter + '" for path: ' + filePath);
            }
            fileContents = filters[filter](fileContents);
          });
        }
      }
      // Apply mandatory cleanup filters
      fileContents = filters['trim-empty-start-lines'](fileContents);
      fileContents = filters['trim-empty-end-lines'](fileContents);
      resolve(fileContents);
    });
  });
};
