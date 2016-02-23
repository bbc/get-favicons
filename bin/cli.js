#!/usr/bin/env node

'use strict';

const fromFaviconsFromStream = require('../from-stream');

const args = require('yargs')
  .usage('Usage: cat some/file.html | $0 [options]')
  .example('$ cat some/file.html | $0 -ms-tile --base-url http://example.com/foo/bar')
  .example('$ curl -Ss http://www.bbc.com | $0')
  .example('> [{"href":"http://static.bbci.co.uk/wwhp/1.96.0/responsive/img/apple-touch/apple-touch-180.jpg","sizes":""}]')
  .option('all', {
    type: 'boolean',
    describe: 'Return all the found favicons — not only the biggest ones.'
  })
  .option('base-url', {
    type: 'string ',
    describe: 'Use this given URL as a relative path against all found favicons paths.'
  })
  .option('ms-tile', {
    type: 'boolean',
    describe: 'Include msTile in the results.'
  })
  .help('help')
  .strict()
  .argv;


fromFaviconsFromStream(process.stdin, args)
  .then(favicons => {
    process.stdout.write(JSON.stringify(favicons), () => process.exit(0));
  })
  .catch(err => {
    console.error(err);
    process.exit(65); // EX_DATAERR BSD exit code
  });
