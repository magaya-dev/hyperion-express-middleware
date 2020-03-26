const debug = require('debug')('hyperion-express-module');
const hyperion = require('@magaya/hyperion-node'); debug('Loaded hyperion...');

/**
 * Creates a express middelware function which can be used to inject
 * hyperion into all incomning request objects.
 * 
 * @param {string[]} args list of comamnd line arguments
 * @param {string} [api] name for requested api
 * 
 * @return {Function} express middlware function
 */
const middleware = function (args, api) {
    if (!args || args.length == 0) {
        debug('Missing arguments...');
        throw new Error('invalid args');
    }

    debug('Trying to connect through addon...');

    const database = hyperion(args, api);

    debug('Hyperion connected...');

    // Keep only name reference to api
    // will either be clientId if an object was sent
    // or api which is a string literal
    if (api && !typeof api === "string") {
        if (typeof api.clientId === "string") {
            api = api.clientId;
        } else {
            api = undefined;    // the value in clientId is not valid
        }
    }

    return function (request, response, next) {
        if (!database) {
            throw new Error(`there is no connection to the database`);
        }

        request.dbx = database.dbx;
        request.dbw = database.dbw;
        request.algorithm = database.algorithm;

        // Try to add api property if possible
        if (api) {
            request.api = database.connection[api];
        }

        next();
    };
};

module.exports = {
    hyperion: hyperion,
    middleware: middleware
};