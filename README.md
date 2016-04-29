# Pull Git Snippets

## Usage

```js
var pullGitSnippets = require('pull-git-snippets');
var repositories = {
  'js-sorting': {
    'user': 'Tyriar',
    'name': 'js-sorting',
    'branch': 'master'
  }
};
var codeSamples = {
  'repository': 'js-sorting',
  'language': 'JavaScript',
  'code': [
    {
      'file': 'lib/merge-sort.js',
      'extractor': 'javascriptFunctionExtractor',
      'extractorValue': 'merge'
    },
    {
      'file': 'lib/merge-sort.js',
      'extractor': 'javascriptFunctionExtractor',
      'extractorValue': 'sort',
      'noSeparator': true
    }
  ]
};
var githubToken = 'secret';
pullGitSnippets(repositories, codeSamples, githubToken);
```

## Extractors

Extractors can be used to pull sub-sections of a file out if including the entire file is not desirable.

## Filters

Filters can be applied to code to clean it up afterwards. Filters are applied in order and their output is piped to the next filter.

- remove-license: Removes a comment in the code that contains the string "license"
- ...
