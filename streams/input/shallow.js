'use strict';

var streamify = require('stream-array');
var fs = require('fs');

/**
 * A readable source for content that doesn't do dependency resolution, but
 * simply reads files and pushes them onto a stream.
 *
 * If an array of strings is provided as input to this method, then
 * they will be treated as filenames and read into the stream.
 *
 * If an array of objects is provided, then we assume that they are valid
 * objects with `source` and `file` properties, and don't use the filesystem
 * at all. This is one way of getting documentation.js to run in a browser
 * or without fs access.
 *
 * @param {Array<string|Object>} indexes entry points
 * @return {ReadableStream} this emits data
 */
module.exports = function (indexes) {
  return streamify(indexes.map(function (index) {
    if (typeof index === 'string') {
      return {
        source: fs.readFileSync(index, 'utf8'),
        file: index
      };
    }
    return index;
  }));
};