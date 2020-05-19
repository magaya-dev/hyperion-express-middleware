# Hyperion-Express-Middleware - Middleware Injection to Requests

## Intro
Node package containing hyperion middleware for express.

```js
const { hyperion, middleware } = require('@magaya/hyperion-express-middleware');
const app = require('express')();

// process.argv needs to include an entry '--connection-string'
// the second parameter is the unique identifier of the application connecting to the database
app.use(middleware(process.argv, 'extension-example'));

// Optionally you can use the hyperion object to create another connection: 
// const connection = hyperion(process.argv, 'extension-example');

// Elsewhere in your router...
router.route('/test').get((request, response) => {
    const dbx = request.dbx;                // hyperion namespaces
    const algorithm = request.algorithm;    // hyperion algorithms
    const api = request.api;                // api functions, defined if an API was requested
    const dbw = request.dbw;                // write access functions, save and edit

    response.send('Success!!');
});
```


## Compatibility

In production, Magaya will handle all the dependencies to ensure the extensions (NodeJS apps) run accordingly, matching compatible versions of the Magaya Explorer, NodeJS, npm and the related Hyperion packages.

In development, you'll need to install the tools that are compatible with the version of Magaya you're using, check the table below:

| Magaya        | NodeJS        |
| ------------- | ------------- |
| v11.3.x      | 12.14.1 [32 bits](https://nodejs.org/dist/v12.14.1/node-v12.14.1-x86.msi) [64 bits](https://nodejs.org/dist/v12.14.1/node-v12.14.1-x64.msi)  |
| v11.2.x       | 8.11.1 [32 bits](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x86.msi) [64 bits](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi)  |
| v11.1.x       | 8.11.1 [32 bits](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x86.msi) [64 bits](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi)  |
| v11.0.3       | 8.11.1 [32 bits](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x86.msi) [64 bits](https://nodejs.org/dist/v8.11.1/node-v8.11.1-x64.msi)  |

## Notes
The second paramenter (`api`) will define which functions are available on the retreived hyperion instance.

Starting with version 11.2 of Magaya, the second parameter can be an object, containing the unique identifier of the application connecting to the database and it's API Key, assigned during installation, for writting purposes.

```js
const { hyperion, middleware } = require('@magaya/hyperion-express-middleware');
const app = require('express')();

app.use(middleware(process.argv, {
    'clientId' : 'extension-example',
    'apiKey' : '123456'
}));
```
