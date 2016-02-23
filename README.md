# get-favicons [![Build Status](https://travis-ci.org/bbcrd/get-favicons.svg?branch=master)](https://travis-ci.org/bbcrd/get-favicons)

> A promise to return a list of favicons contained in some HTML content.

The streaming approach helps remaining efficient in spite of malformed or very large HTML documents.

**Notice**: this module requires `node>=4` to work.

# Install

```bash
$ npm install --save get-favicons
```

# Usage

## Node API

```js
const getFavicons = require('get-favicons');
const hyperquest = require('hyperquest');

const stream = hyperquest('http://www.bbc.com');

getFavicons(stream).then(icons => {
  // ...
});
```

You can also analyse a set of `<head>` tags provided as an array of objects
(eg: like these provided by [`parse-head`](https://npmjs.com/parse-head)):

```js
const getFavicons = require('get-favicons/from-array');

const headers = [ { nodeName: 'LINK', type: 'icon', href: '...'  }, ... ];

getFavicons(headers).then(icons => {
  // ...
});
```

## Command line

```bash
Usage: cat some/file.html | get-favicons [options]

Options:
  --all       Return all the found favicons — not only the biggest ones.
                                                                       [boolean]
  --base-url  Use this given URL as a relative path against all found favicons
              paths.
  --ms-tile   Include msTile in the results.                           [boolean]
  --help      Show help                                                [boolean]

Examples:
  cat some/file.html | get-favicons -ms-tile --base-url http://example.com/foo/bar
  curl -Ss http://www.bbc.com | get-favicons
```


# License

> Copyright 2016, British Broadcasting Corporation
> 
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
> 
>     http://www.apache.org/licenses/LICENSE-2.0
> 
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.