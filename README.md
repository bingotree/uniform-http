uniform-http
============

A simple, extensible http library wrapper that ensures all request methods, response formats, and error formats are the same, regardless of the underlying implementation.

## Guarantees
- Uniform, common-sense config format. `// { port: 3000, domain: 'www.example.com', etc ... }`
- HttpClients created by this wrapper will have methods corresponding to the common http verbs: `get()`, `patch()`, `put()`, etc
- All successful responses (2## range) return a uniform object with a http status code and data.
- All error responses, *regardless of where the error originated*, return a `UniformHttpError` which contains details that include the http status code, original error details, etc.
- A status code of `0` indicates an error on the client side.
- Any situation where the remote server cannot be contacted, for whatever reason, will *always* return a UniformHttpError with status of `503 Service Unavailable`. 
- Status codes use the very popular `http-status-codes` library, so follow the RFC formats.

## Installation

`npm install uniform-http`

## Usage

```
const createHttpClient = require('uniform-http');
const config = {
  domain: 'example.com',
  port: 3000,
  protocol: 'http' // default
};
const rest = createHttpClient(config); // (config={}, adapter='axios')
rest.get('/stuff')
  .then(res => console.log(res.status, res.data)) // 200, { ... }
  .catch(err => {
    console.log(error.name) // 'UniformHttpError'
    const details = err.details;
    console.log(details.status, details.statusText); // 503, 'Service Unavailable'
  });
```

## Tests

`npm run test`

## Details / Features

### Available http-lib adapters
- axios

### Comes with default http library out of the box - axios

### Response format
Guaranteed to always return the axios response format { data, headers, status, statusText, ... }

### Error format
Guaranteed to always be `UniformHttpError`s which always contain a `details` object with http status codes, text, and other helpful information.
                
## Contributing
This module is written using es6 and es7 experimental methods and then transpiled with babel. Download the repo and work in the src/ folder to contribute. Then run `npm run build` and `npm run build:test` to test.

Follow the model set out in the axios adapter and ensuring the *Guarantees* above are met.

## TODO
*General*
- config-less requests ... eg `get('http://domain.com:30/foo?bar=baz', ...)`
- Add adapters for more http libraries (axios-only right now).
- Only install adapters needed (ie split adapters into their own npm modules, scope)

*Testing*
- Async testing in test.js could be fixed up.
- Server mocks

*MISC*
- [Avoid Jack Handy boat-whittling scenario?](https://gist.github.com/bingotree/8926ea8437087733116c7c7374898299)
