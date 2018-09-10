# Hyperion-Express-Middleware - Middleware Injection to Requests

## Intro
Node package containing hyperion middleware for express.

```js
// process.argv needs to include an entry '--connection-string'
// only the arguments array is mandatory
const { hyperion, middleware } = require('@magaya/hyperion-express-middleware');
const app = require('express')();

app.use(middleware(process.argv, 'optionalApiName'));

// Optionally you can use the hyperion object to create another connection: 
// const connection = hyperion(process.argv, 'optionalApiName');

// Elsewhere in your router...
router.route('/test').get((request, response) => {
    const dbx = request.dbx;                // hyperion namespaces
    const algorithm = request.algorithm;    // hyperion algorithms
    const api = request.api;                // api functions, defined if an API was requested
    const dbw = request.dbw;                // write access functions, save and edit

    response.send('Success!!');
});
```

## Notes
The second paramenter (`api`) will define which functions are available on the retreived hyperion instance. It is optional.