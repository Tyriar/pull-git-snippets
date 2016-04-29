# sync-code-samples.js

## Usage

```bash
node sync-code-samples.js <GITHUB_API_TOKEN>
```

## Extractors

Extractors can be used to pull sub-sections of a file out if including the entire file is not desirable.

## Filters

Filters can be applied to code to clean it up afterwards. Filters are applied in order and their output is piped to the next filter.

- remove-license: Removes a comment in the code that contains the string "license"
- ...
