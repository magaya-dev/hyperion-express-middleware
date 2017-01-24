module.exports = function (moduleName, args) {
    const database = require('./hyper-api')({
            module: moduleName,
            argv: args
        });
    
    return function (request, response, next) {
        if (!database) {
            throw new Error('Candela!');
        }

        request.dbx = database.dbx;
        request.algorithm = database.algo;
        request.api = database.api;

        next();
    };
};