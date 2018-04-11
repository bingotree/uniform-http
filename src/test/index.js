import assert from 'assert';
import createHttpClient from '../index';

describe('Setup and network connection', () => {
  const rest = createHttpClient();
  it('Should set a default config', () => {
    assert.deepStrictEqual(rest.config.port, 80);
    assert.deepStrictEqual(rest.config.domain, 'localhost');
    assert.deepStrictEqual(rest.config.protocol, 'http');
  });
  it('init() should allow for the config to be changed', () => {
    const newConfig = {
      port: 3000,
      domain: 'www.google.com',
      protocol: 'https',
    };
    rest.init(newConfig);
    assert.deepStrictEqual(rest.config.port, newConfig.port);
    assert.deepStrictEqual(rest.config.domain, newConfig.domain);
    assert.deepStrictEqual(rest.config.protocol, newConfig.protocol);
  });
  it('Should throw an error if adapter is invalid', () => {
    let result = false;
    try {
      createHttpClient({}, 'null');
    } catch (error) {
      result = true;
    }
    assert.strictEqual(result, true);
  });
});
// TODO mock servers?
describe('Response format', () => {
  it('Should return response data as a js object, with status code field', (done) => {
    const rest = createHttpClient({
      port: 3001,
    });
    rest.get('/routes')
      .then((res) => {
        assert.deepStrictEqual(typeof res, 'object');
        assert.deepStrictEqual('data' in res, true);
        assert.deepStrictEqual('status' in res, true);
        assert.deepStrictEqual('statusText' in res, true);
        assert.deepStrictEqual('headers' in res, true);
        assert.deepStrictEqual(typeof res.data, 'object');
        assert.deepStrictEqual(typeof res.status, 'number');
        assert.deepStrictEqual(typeof res.statusText, 'string');
        assert.deepStrictEqual(typeof res.headers, 'object');
        done();
      })
      .catch((err) => { console.log(err.message); assert.strictEqual(false, true); done(); });
  });
});
describe('Successful status codes', () => {
  it('Should return 200 response', (done) => {
    const rest = createHttpClient({
      port: 3001,
    });
    rest.get('/routes')
      .then((res) => {
        assert.deepStrictEqual(res.status, 200);
        done();
      })
      .catch((err) => { console.log(err.message); assert.strictEqual(false, true); done(); });
  });
});
describe('Error format', () => {
  it('Error is a UniformHttpError object with key "details", containing uniform fields - status, message, etc', (done) => {
    const rest = createHttpClient({
      port: 0,
    });
    rest.get('/routes')
      .then(() => done())
      .catch((err) => {
        assert.deepStrictEqual(typeof err, 'object');
        assert.deepStrictEqual(err.name, 'UniformHttpError');
        assert.deepStrictEqual('message' in err, true);
        assert.deepStrictEqual('details' in err, true);
        assert.deepStrictEqual('originalError' in err.details, true);
        assert.deepStrictEqual('message' in err.details, true);
        assert.deepStrictEqual('originalMessage' in err.details, true);
        assert.deepStrictEqual('status' in err.details, true);
        assert.deepStrictEqual('statusText' in err.details, true);
        assert.deepStrictEqual('originalStatusText' in err.details, true);
        assert.deepStrictEqual('headers' in err.details, true);
        assert.deepStrictEqual('data' in err.details, true);
        done();
      });
  });
});
describe('Error status codes', () => {
  it('Should return 503 -- bad port number', (done) => {
    const rest = createHttpClient({
      port: 0,
    });
    rest.get('/routes')
      .then(() => done())
      .catch((err) => {
        const error = err.details;
        assert.deepStrictEqual(error.status, 503);
        done();
      });
  });
});
