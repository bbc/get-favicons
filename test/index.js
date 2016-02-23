'use strict';

const test = require('blue-tape');
const parseHead = require('parse-head');
const fs = require('fs');

const fromStream = require('..');
const fromArray = require('../from-array');

test('from a stream', t => {
  const stream = fs.createReadStream(`${__dirname}/sample.html`);

  return fromStream(stream).then(icons => {
    t.equal(icons.length, 2);
    t.equal(icons[0].href, '/android-chrome-192x192.png');
    t.equal(icons[1].href, '/the_favicon/favicon.ico');
  });
});

test('from an array', t => {
  const stream = fs.createReadStream(`${__dirname}/sample.html`);

  return parseHead(stream).then(fromArray).then(icons => {
    t.equal(icons.length, 2);
    t.equal(icons[0].href, '/android-chrome-192x192.png');
    t.equal(icons[1].href, '/the_favicon/favicon.ico');
  });
});

test('with a baseUrl option', t => {
  const stream = fs.createReadStream(`${__dirname}/sample.html`);

  return fromStream(stream, { baseUrl: 'http://example.com/foo/bar' }).then(icons => {
    t.equal(icons[0].href, 'http://example.com/android-chrome-192x192.png');
  });
});

test('from a <base> tag contained in the head', t => {
  const stream = fs.createReadStream(`${__dirname}/baseurl.html`);

  return fromStream(stream).then(icons => {
    t.equal(icons[0].href, 'http://www.example.com/android-chrome-192x192.png');
  });
});

test('including msTile', t => {
  const stream = fs.createReadStream(`${__dirname}/sample.html`);

  return fromStream(stream, { msTile: true }).then(icons => {
    t.equal(icons.length, 3);
  });
});