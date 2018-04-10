uniform-http
============

A simple, extensible http library wrapper that ensures all request methods, response formats, and error formats are the same, regardless of the underlying implementation.

## Objective
The objective of this module is to give developers peace of mind -- that no matter what underlying http library they choose, the request methods, as well as the errors and responses will all have a uniform format.

## Goals
- Independent of underlying http library (axios, fetch, etc)
- Uniform response format and error objects.

## Usage
From the prompt
`npm i --save uniform-http`

In your script
```
const getClient = require('uniform-http');
const config = {
  domain: 'example.com',
  port: 3000,
  protocol: 'http' // default
};
const rest = getClient(config); // (config={}, adapter='axios')
rest.get('/stuff')
  .then(res => console.log(res.status, res.data))
  .catch(err => {
    let error = JSON.parse(err.message);
    console.log(error.code, error.message);
  });
```

## Details / Features

### Comes with default http library out of the box - Axios

### Available adapters
- axios

### Response format 
Follows the axios response format { data, headers, status, statusText, ... }

### Error format
```
Error Object :
{  message: <JSON STRING>
  ... usual Error stuff here
}
JSON.parse(Error.message): 
{
  code:
  message: ... actual message from server
}
```

### Uniform response codes.
When unable to connect to server (eg client or server connection is down), a 503 error is always returned.
                
## Extension / Write your own Adapters
The goal of this module was to give developers peace of mind -- no matter what underlying http library they choose, the request methods, as well as the errors and responses will all have a uniform format.

If you have a particular format you like, you can write your own adapters.

## TODO
*General*
- Add adapters for more http libraries (axios-only right now).
- Only install adapters needed (ie split adapters into their own npm modules)

*Testing*
- Async testing in test.js could be fixed up up.
- Server mocks

*MISC*
- Avoid Jack Handy boat-whittling scenario?
