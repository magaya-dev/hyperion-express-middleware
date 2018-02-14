# Hyperion-Express-Middleware - Middleware Injection to Requests

## Intro
Node package containing hyperion middleware for express.

```js
const hyperion = require('@magaya/hyperion-express-middleware')('appName', 'apiName', argv);
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
The second paramenter (`api`) will define which functions are available on the retreived hyperion instance.