const assert = require('assert');
const hyperion = require('../../index');

const middlewareWithoutApi = hyperion(['--connection-string=test.magaya.com:6110']);

assert.ok(middlewareWithoutApi);

const middlewareWithApi = hyperion(['--connection-string=test.magaya.com:6110'], 'livetrack');

assert.ok(middlewareWithApi);