const hyperion = require('hyperion-node');

module.exports = function (moduleName, api, args) {
    if (!moduleName) {
        throw new Error('No module name was provided');
    }

    const database = hyperion({
        name: moduleName,
        argv: args
    });

    return function (request, response, next) {
        if (!database) {
            throw new Error(`There is no connection to the database for ${moduleName}`);
        }

        request.dbx = database.dbx;
        request.algorithm = database.algorithm;

        if (api) {
            request.api = database.connection[api];
        }

        next();
    };
};