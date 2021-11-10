/* @flow */

import _ from 'lodash';
import isJSDocComment from '../is_jsdoc_comment.js';
import parse from '../parse.js';

/**
 * Convert linear offset to a line:column position
 *
 * @param {string} text
 * @param {number} position
 */
function getPosition(text, position) {
  const line = (text.substring(0, position).match(/\n/g) || []).length + 1;
  const lastNewLine = text.substring(0, position).lastIndexOf('\n');
  const column = position - (lastNewLine !== -1 ? lastNewLine : 0) + 1;
  return { line, column };
}

/**
 * Dumb (no AST) extraction of the comments from a source file using RegExps
 *
 * @param {string} text
 * @returns {Array<Object>}
 */
function getComments(source) {
  if (typeof source !== 'string')
    throw new TypeError('getComments expects a string');
  const res = [];
  for (const comment of source.matchAll(
    /\/\*(\*\s(\*(?!\/)|[^*])*)\*\/\s*(.*)/g
  )) {
    const obj = {
      after: comment[3],
      api: comment[1].indexOf('@api') !== -1,
      start: comment.index,
      end: comment.index + comment[1].length,
      type: 'Block',
      value: comment[1],
      loc: {
        start: getPosition(source, comment.index + 1),
        end: getPosition(source, comment.index + 1 + comment[1].length)
      }
    };
    res.push(obj);
  }
  return res;
}

/**
 * Documentation stream parser: this receives a module-dep item,
 * reads the file, parses the JavaScript, parses the JSDoc, and
 * emits parsed comments.
 * @param sourceFile a chunk of data provided by module-deps
 * @return {Array<Object>} adds to memo
 */
export default function parsePolyglot(sourceFile) {
  return getComments(sourceFile.source)
    .filter(isJSDocComment)
    .map(comment => {
      const context = {
        loc: _.clone(comment.loc),
        file: sourceFile.file,
        sortKey: sourceFile.file + ' ' + comment.loc.start.line
      };
      return parse(comment.value, comment.loc, context);
    });
}
