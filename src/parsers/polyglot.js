/* @flow */

import getComments from 'get-comments';
import _ from 'lodash';
import isJSDocComment from '../is_jsdoc_comment.js';
import parse from '../parse.js';

/**
 * Documentation stream parser: this receives a module-dep item,
 * reads the file, parses the JavaScript, parses the JSDoc, and
 * emits parsed comments.
 * @param sourceFile a chunk of data provided by module-deps
 * @return {Array<Object>} adds to memo
 */
export default function parsePolyglot(sourceFile) {
  return getComments(sourceFile.source, true)
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
