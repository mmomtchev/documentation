import * as fs from 'fs';
import * as path from 'path';
import removePosition from '../../../src/remark-remove-position.js';
import { remark } from 'remark';
const remarkParse = remark().use(removePosition).parse;
import polyglot from '../../../src/parsers/polyglot.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('polyglot', function () {
  const file = path.resolve(
    path.join(__dirname, '../../fixture/polyglot/blend.cpp')
  );
  const result = polyglot({
    file,
    source: fs.readFileSync(file, 'utf8')
  });
  delete result[0].context.file;
  delete result[0].context.sortKey;
  expect(result).toEqual([
    {
      errors: [],
      augments: [],
      examples: [],
      implements: [],
      properties: [],
      throws: [],
      todos: [],
      yields: [],
      sees: [],
      context: {
        loc: { end: { column: 2, line: 40 }, start: { column: 3, line: 35 } }
      },
      description: remarkParse('This method moves a hex to a color'),
      loc: { end: { column: 2, line: 40 }, start: { column: 3, line: 35 } },
      name: 'hexToUInt32Color',
      params: [
        {
          lineNumber: 3,
          title: 'param',
          name: 'hex',
          type: {
            name: 'string',
            type: 'NameExpression'
          }
        }
      ],
      returns: [
        {
          title: 'returns',
          description: remarkParse('color'),
          type: {
            name: 'number',
            type: 'NameExpression'
          }
        }
      ],
      tags: [
        {
          description: null,
          lineNumber: 2,
          name: 'hexToUInt32Color',
          title: 'name'
        },
        {
          description: null,
          lineNumber: 3,
          name: 'hex',
          title: 'param',
          type: {
            name: 'string',
            type: 'NameExpression'
          }
        },
        {
          description: 'color',
          lineNumber: 4,
          title: 'returns',
          type: {
            name: 'number',
            type: 'NameExpression'
          }
        }
      ]
    }
  ]);
});
