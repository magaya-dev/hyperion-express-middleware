# Hyperion-Express-Middleware - Middleware Injection to Requests

## Intro
Node package containing hyperion middleware for express.

```js
// process.argv needs to include an entry '--connection-string'
// only the arguments array is mandatory
const hyperion = require('@magaya/hyperion-express-middleware')(process.argv, 'optionalApiName');
const app = require('express')();

app.use(hyperion);

// Elsewhere in your router...
router.route('/test').get((request, response) => {
    const dbx = request.dbx;                // hyperion namespaces
    const algorithm = request.algorithm;    // hyperion algorithms
    const api = request.api;                // api functions

    response.send('Success!!');
});
```

## Notes
The second paramenter (`api`) will define which functions are available on the retreived hyperion instance. It is optional.

## Development
When using this package for development make sure you include _@magaya/hyperion-node_ in your _devDependencies_ like so:

`npm install @magaya/hyperion-node --save-dev`

Otherwise there will be a runtime failure as hyperion will not be found. In production hyperion will be installed globally.