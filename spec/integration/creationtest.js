const assert = require('assert');
const { middleware } = require('../../index');

const middlewareWithoutApi = middleware(['--connection-string=test.magaya.com:6110']);

assert.ok(middlewareWithoutApi);

const middlewareWithApi = middleware(['--connection-string=test.magaya.com:6110'], 'livetrack');

assert.ok(middlewareWithApi);