'use strict';

const parseHead = require('parse-head');
const getFavicons = require('./from-array');

module.exports = function fromStream(stream, args) {
  return parseHead(stream).then(headers => getFavicons(headers, args));
};