const hyperion = require('./build/hyperion');
const dbx = hyperion.Connect('livetrack-mobile', process.argv); 

module.exports = function (request, response, next) {
    if (!dbx) {
        throw new Error('Candela!');
    }

    request.dbx = dbx;
    next();
}