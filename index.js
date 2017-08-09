const database = require('./hyper-api');

module.exports = function (moduleName, args) {
    const connection = database({
            name: moduleName,
            argv: args
        });
    
    return function (request, response, next) {
        if (!connection) {
            throw new Error(`There is no connection to the database for ${moduleName}...`);
        }

        request.dbx = connection.dbx;
        request.algorithm = connection.algo;
        request.api = connection.api;

        next();
    };
};