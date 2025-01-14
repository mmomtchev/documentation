let initCb, parseCb, dummy;

export function mockInit(init, parse) {
  initCb = init;
  parseCb = parse;
}

export async function init(config) {
  if (initCb) initCb(...arguments);
  if (!config.flatteners) config.flatteners = {};
  config.flatteners['customTag'] = (result, tag, name) => {
    if (name !== 'customTag')
      throw new Error('customTag received unexpected tag');
    tag.customField = true;
  };
  dummy = [
    {
      value: '*\n * @method dummy\n ',
      context: {
        file: 'plugin.txt',
        loc: { start: { line: 5, column: 1 }, end: { line: 5, column: 4 } },
        sortKey: 'a'
      },
      loc: { start: { line: 0, column: 1 }, end: { line: 2, column: 1 } }
    },
    {
      value: '*\n * @param {number} dummy_param\n ',
      context: {
        file: 'plugin.txt',
        loc: { start: { line: 5, column: 1 }, end: { line: 5, column: 4 } },
        sortKey: 'b',
        kind: 'method',
        name: 'dummy_method'
      },
      loc: { start: { line: 0, column: 1 }, end: { line: 2, column: 1 } }
    },
    {
      value: '*\n * @method not_so_dummy\n ',
      context: {
        file: 'plugin.txt',
        loc: { start: { line: 5, column: 1 }, end: { line: 5, column: 4 } },
        sortKey: 'c',
        kind: 'SHOULD_NOT_APPEAR_IN_THE_RESULT',
        name: 'SHOULD_NOT_APPEAR_IN_THE_RESULT'
      },
      loc: { start: { line: 0, column: 1 }, end: { line: 2, column: 1 } }
    },
    {
      value: '*\n * @customTag customName\n ',
      context: {
        file: 'plugin.txt',
        loc: { start: { line: 5, column: 1 }, end: { line: 5, column: 4 } },
        sortKey: 'x'
      },
      loc: { start: { line: 0, column: 1 }, end: { line: 2, column: 1 } }
    }
  ];
}

export function parse(file, _config, api) {
  if (parseCb) parseCb(...arguments);
  if (file.file.includes('plugin.txt'))
    return dummy.map(c => api.parseJSDoc(c.value, c.log, c.context, _config));
  return false;
}
