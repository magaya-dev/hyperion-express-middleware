const debug = require('debug')('hyperion-express-module');
const hyperion = require('@magaya/hyperion-node'); debug('Loaded hyperion...');

module.exports = function (args, api) {
    debug('Trying to connect through addon...');

    const database = hyperion(args, api);

    debug('Hyperion connected...');

    return function (request, response, next) {
        if (!database) {
            throw new Error(`there is no connection to the database`);
        }

        request.dbx = database.dbx;
        request.algorithm = database.algorithm;

        if (api) {
            request.api = database.connection[api];
        }

        next();
    };
};