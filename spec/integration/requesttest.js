const assert = require('assert');
const express = require('express');
const http = require('http');
const hyperion = require('../../index');

const middleware = hyperion.middleware(['--connection-string=test.magaya.com:6110'], 'livetrack');
const app = express();

app.use('/test', middleware, (req, res) => {
    assert.ok(req.dbx, 'missing dbx');
    assert.ok(req.algorithm, 'missing algorithms');
    assert.ok(req.api, 'missing api');
    assert.ok(req.dbw, 'missing dbw');

    res.status(200).send();
});

const httpServer = app.listen('1337');

http.get('http://localhost:1337/test', res => {
    httpServer.close(error => {
        process.exit(0);
    });
});