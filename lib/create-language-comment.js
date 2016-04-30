'use strict';

var languageCommentDefinitions = {
  java: {
    singleLine: {
      start: '// '
    },
    multiLine: {
      start: '/* ',
      end: ' */'
    }
  },
  javascript: {
    singleLine: {
      start: '// '
    },
    multiLine: {
      start: '/* ',
      end: ' */'
    }
  },
  python: {
    singleLine: {
      start: '# '
    },
    multiLine: {
      start: '"""\n',
      end: '\n"""'
    }
  }
};

var languageExtensions = {
  java: 'java',
  js: 'javascript'
};

function isSingleLine(comment) {
  return comment.indexOf('\n') === -1;
}

function getCommentType(comment) {
  if (isSingleLine(comment)) {
    return 'singleLine';
  }
  return 'multiLine';
}

function createLanguageComment(comment, language) {
  var languageDefinition = languageCommentDefinitions[language];
  if (!languageDefinition) {
    throw new Error('No comment definition for language "' + language + '"');
  }

  var commentType = getCommentType(comment);
  var commentTypeDefinition = languageDefinition[commentType];
  if (!commentTypeDefinition) {
    throw new Error('No comment type definition for language "' + language + '" and type "' + commentType + '"');
  }

  var result = '';
  if (commentTypeDefinition.start) {
    result += commentTypeDefinition.start;
  }
  result += comment;
  if (commentTypeDefinition.end) {
    result += commentTypeDefinition.end;
  }
  return result;
}

module.exports = {
  byExtension: function (comment, extension) {
    return createLanguageComment(comment, languageExtensions[extension]);
  },
  byLanguage: createLanguageComment
};
