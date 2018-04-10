import axios from 'axios';
import HttpStatus from 'http-status-codes';

class UniformHttpError extends Error {
  constructor(message, details) {
    super(message);
    this.stack = Error().stack;
    this.details = details;
    this.name = 'UniformHttpError';
  }
}

class Adapter {
  constructor(config = {}) {
    this.init(config);
  }
  init(config = {}) {
    this.config = Object.assign({}, Adapter.defaultConfig, config);
  }
  static errorHandler(error) {
    return new UniformHttpError(error.message, { originalError: error }); // should return, *not* throw an error.
  }
}
// --- Static data members.
Adapter.defaultConfig = {
  domain: 'localhost',
  port: 80,
  protocols: ['http'], // , https
  protocol: 'http', // default protocol
  timeout: 10000, // ms
};


// --- Adapters
class AxiosAdapter extends Adapter {
  constructor(config = {}) {
    super(config);
  }
  init(config) {
    super.init(config); // updates this.config
    this.axios = AxiosAdapter.create({
      baseURL: `${this.config.protocol}://${this.config.domain}:${this.config.port}`,
      timeout: this.config.timeout,
    });
  }
  static create(axiosConfig) {
    return axios.create(axiosConfig);
  }
  get(endpoint = '/', params = {}) {
    return new Promise((resolve, reject) => this.axios.get(endpoint, { params })
      .then(res => resolve(AxiosAdapter.responseHandler(res)))
      .catch(err => reject(AxiosAdapter.errorHandler(err))));
  }
  post(endpoint = '/', data = {}, params = {}) {
    return new Promise((resolve, reject) => this.axios.post(endpoint, data, { params })
      .then(res => resolve(AxiosAdapter.responseHandler(res)))
      .catch(err => reject(AxiosAdapter.errorHandler(err))));
  }
  put(endpoint = '/', data = {}, params = {}) {
    return new Promise((resolve, reject) => this.axios.put(endpoint, data, { params })
      .then(res => resolve(AxiosAdapter.responseHandler(res)))
      .catch(err => reject(AxiosAdapter.errorHandler(err))));
  }
  patch(endpoint = '/', data = {}, params = {}) {
    return new Promise((resolve, reject) => this.axios.patch(endpoint, data, { params })
      .then(res => resolve(AxiosAdapter.responseHandler(res)))
      .catch(err => reject(AxiosAdapter.errorHandler(err))));
  }
  delete(endpoint = '/', params = {}) {
    return new Promise((resolve, reject) => this.axios.delete(endpoint, { params })
      .then(res => resolve(AxiosAdapter.responseHandler(res)))
      .catch(err => reject(AxiosAdapter.errorHandler(err))));
  }
  //    post(endpoint, params)
  //    patch(endpoint, params)
  //    put(endpoint, params)
  //    delete(endpoint)
  static responseHandler(axiosResponse) {
    return {
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers: axiosResponse.headers,
      data: axiosResponse.data,
    };
  }
  static errorHandler(axiosError) {
    // Defaults
    const errorDetails = {
      originalError: axiosError, // So we can access stack trace, etc
      message: 'An error occurred.', // Client facing message.
      originalMessage: axiosError.message, // The actual error message.
      status: 0, // the http status code, we use '0' for client errors.
      statusText: null, // Uniform HTTP status text - based on status code
      originalStatusText: null, // The text the remote server sends us.
      headers: null, // remote server response headers
      data: null, // remote server data
    };
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorDetails.status = axiosError.response.status;
      errorDetails.statusText = HttpStatus.getStatusText(axiosError.response.status);
      errorDetails.originalStatusText = axiosError.response.statusText;
      errorDetails.data = axiosError.response.data;
      errorDetails.headers = axiosError.responseHeaders;
    } else if (axiosError.request) {
      // 503 The request was made but no response was received
      // `axiosError.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      errorDetails.status = HttpStatus.SERVICE_UNAVAILABLE;
      errorDetails.statusText = HttpStatus.getStatusText(HttpStatus.SERVICE_UNAVAILABLE);
      errorDetails.message = HttpStatus.getStatusText(HttpStatus.SERVICE_UNAVAILABLE);
    } else {
      // Client error.
      // -- left blank intentionally, uses defaults --
    }
    return new UniformHttpError(errorDetails.message, errorDetails);
  }
}
export default {
  axios: AxiosAdapter,
};
