'use strict';

const url = require('url');
const noop = d => d;

const DEFAULT_OPTIONS = {
  all: false,
  baseUrl: '',
  msTile: false
};

module.exports = function getFavicons (headers, args) {
  const options = Object.assign({}, DEFAULT_OPTIONS, args);

  return new Promise(resolve => {
    if (!Array.isArray(headers)) {
      throw new Error('getFavicons first and only argument should be an array of HTML <head> attributes.')
    }

    resolve(
      headers
        .map(mapIcon.bind(null, options))
        .filter(icon => icon && icon.href)
        .sort((a, b) => getWidth(b.sizes) - getWidth(a.sizes))
        .filter(generateAllFilter(options))
        .filter(uniqueHrefFilter)
        .map(generateBaseUrlMap(options, headers))
    );
  });
};

function mapIcon (options, header) {
  // apple-touch-icon
  if (header.rel && header.rel === 'apple-touch-icon') {
    return {
      href: header.href || null,
      sizes: header.sizes || ''
    };
  }

  // modern icon (also covers IE9 w/ type="image/x-icon")
  if (header.rel === 'icon') {
    return {
      href: header.href || null,
      sizes: header.sizes || ''
    }
  }

  // Microsoft TileImage
  if (options.msTile && header.name && header.name === 'msapplication-TileImage') {
    return {
      href: header.content || null,
      sizes: ''   // fetch it from URL pattern
    };
  }

  // legacy favicon.ico
  if (header.rel && header.rel.indexOf('icon') && header.rel.indexOf('shortcut') !== -1) {
    return {
      href: header.href || null,
      sizes: ''
    };
  }
}

function getWidth (sizes) {
  return sizes ? parseInt(sizes.split('x')[0]) : 0;
}

function generateAllFilter (options) {
  const MAX_ITEMS = 1;

  return options.all ? noop : (icon, i, array) => {
    return icon.sizes === '' || array.slice(0, i).length < MAX_ITEMS;
  };
}

function uniqueHrefFilter (icon, i, array) {
  return array.slice(i+1).find(d => d.href === icon.href) === undefined;
}

function generateBaseUrlMap (options, headers) {
  let baseUrl = options.baseUrl;

  if (!baseUrl) {
    const header = headers.find(h => h.nodeName === 'BASE' && h.href);

    if (header && header.href) {
      baseUrl = header.href;
    }
  }

  return !baseUrl ? noop : (icon) => Object.assign(icon, { href: url.resolve(baseUrl, icon.href) });
}
