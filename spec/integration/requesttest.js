const assert = require('assert');
const express = require('express');
const http = require('http');
const hyperion = require('../../index');

const middleware = hyperion(['--connection-string=test.magaya.com:6110'], 'livetrack');
const app = express();

app.use('/test', middleware, (req, res) => {
    assert.ok(req.dbx);
    assert.ok(req.algorithm);
    assert.ok(req.api);

    res.status(200).send();
});

const httpServer = app.listen('1337');

http.get('http://localhost:1337/test', res => {
    httpServer.close(error => {
        process.exit(0);
    });
});




