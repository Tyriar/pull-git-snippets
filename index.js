'use strict';

var fs = require('fs');

var Github = require('github-api');
var requireDir = require('require-dir');

var getGithubFileContent = require('./lib/get-github-file-content');
var wrapCodeInPrettifyPre = require('./lib/wrap-code-in-prettify-pre');
//var repositories = require('./repositories');
//var codeSamples = requireDir('code-samples', { recurse: true });
var reportError = require('./lib/report-error');

var repositories;
var codeSamples;

function printUsage() {
  console.log('Usage:');
  console.log('  $ node sync-code-samples.js <github_api_token>');
}

function writeJekyllInclude(fileName, code) {
  console.log('Writing ' + fileName);
  var fileContent = code;
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName);
  }
  fs.writeFile(fileName, fileContent, function(err) {
    if (err) {
      throw err;
    }
  });
}

/**
 * Fetch a language code sample from GitHub.
 * @param {Object} languageCodeSample The language code sample spec to fetch.
 */
function fetchLanguageCodeSample(github, languageCodeSample) {
  return new Promise(function(resolve, reject) {
    var repository = repositories[languageCodeSample.repository];
    // TODO: Cache github repos here
    if (typeof repository === 'undefined') {
      reportError('Repository "' + languageCodeSample.repository + '" definition does not exist');
      process.exit(1); // eslint-disable-line no-process-exit
    }
    var path = languageCodeSample.code;
    var promises = path.map(function (currentPath) {
      return getGithubFileContent(github, repository.user, repository.name, repository.branch, currentPath);
    });
    Promise.all(promises).then(function(fileContents) {
      var fileContent = fileContents[0];
      for (var i = 1; i < fileContents.length; i++) {
        var separator = '\n\n\n\n';
        if (path[i].noSeparator) {
          separator = '\n\n';
        }
        fileContent += separator + fileContents[i];
      }
      fileContent = wrapCodeInPrettifyPre(fileContent, languageCodeSample.language);
      resolve(fileContent);
    }, function () {
      reportError('Failed to retrieve all files in: ' + (typeof path[0] === 'string' ? path[0] : path[0].file));
      reject();
    });
  });
}

function getRepositoryUrl(repository) {
  return 'https://github.com/' + repository.user + '/' + repository.name + '/blob/' + repository.branch + '/';
}

function sanitiseHeaderForAttr(header) {
  return header.replace('#', 'x');
}

function wrapCodeInCodeBlock(codeSample, code) {
  var markup = '<div class="code-block start"';
  var headers = '';
  codeSample.forEach(function (languageCodeSample) {
    if (headers.length) {
      headers += '|';
    }
    headers += languageCodeSample.language;
    var attr = 'data-' + sanitiseHeaderForAttr(languageCodeSample.language) + '-github';
    var url = getRepositoryUrl(repositories[languageCodeSample.repository]) + (languageCodeSample.link || languageCodeSample.code[0].file);
    markup += ' ' + attr + '="' + url + '"';
  });
  markup += ' data-headers="' + headers + '"></div>';
  markup += code;
  markup += '<div class="code-block end"></div>';
  return markup;
}

function generateCodeSample(github, codeSample, codeSampleName) {
  // Use a closure since codeSampleName is being within an inner Promise
  (function (name) {
    if (!fs.existsSync('_includes/code-samples/')) {
      fs.mkdirSync('_includes/code-samples/');
    }
    console.log('Generating ' + name + '...');

    var promises = codeSample.map(function (languageCodeSample) {
      return fetchLanguageCodeSample(github, languageCodeSample);
    });
    Promise.all(promises).then(function(languageCodeSamples) {
      var code = languageCodeSamples.join('\n');
      var fileName = '_includes/code-samples/' + name + '.html';
      var markup = wrapCodeInCodeBlock(codeSample, code);
      writeJekyllInclude(fileName, markup);
    });
  })(codeSampleName);
}

function sync(_repositories, _codeSamples, githubToken) {
  repositories = _repositories;
  codeSamples = _codeSamples;

  if (!githubToken) {
    reportError('No GitHub API token specified.');
    printUsage();
    return;
  }

  var github = new Github({
    token: githubToken,
    auth: 'oauth'
  });

  for (var codeSampleName in codeSamples) {
    generateCodeSample(github, codeSamples[codeSampleName], codeSampleName);
  }
}

module.exports = sync;
