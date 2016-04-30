'use strict';

var escapeHtml = require('escape-html');

function languageToPrettifyLanguage(language) {
  switch (language) {
    case 'C#': return 'lang-csharp';
    case 'Java': return 'lang-java';
    case 'JavaScript': return 'lang-js';
    case 'Python': return 'lang-py';
    case 'Ruby': return 'lang-rb';
    default: return undefined;
  }
}

function wrapInPre(code, language) {
  var lang = languageToPrettifyLanguage(language);
  var wrappedCode = '<pre class="prettyprint"><code';
  if (lang) {
    wrappedCode += ' class="' + lang + '"';
  }
  wrappedCode += '>' + code + '</code></pre>';
  return wrappedCode;
}

module.exports = function (code, language) {
  var escapedCode = escapeHtml(code);
  return wrapInPre(escapedCode, language);
};
