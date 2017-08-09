const hyperion = require('hyperion-node');

module.exports = function (moduleName, args) {
    const database = hyperion({
            name: moduleName,
            argv: args
        });
    
    return function (request, response, next) {
        if (!database) {
            throw new Error(`There is no connection to the database for ${moduleName}...`);
        }

        request.dbx = database.dbx;
        request.algorithm = database.algorithm;
        request.api = database.connection.livetrack;

        next();
    };
};