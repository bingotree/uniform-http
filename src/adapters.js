import axios from 'axios';

class Adapter {
  constructor(config = {}) {
    this.init(config);
  }
  init(config = {}) {
    this.config = Object.assign({}, Adapter.defaultConfig, config);
  }
  static errorHandler(error) {
    return error; // should return, *not* throw an error.
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
Adapter.errorCodes = {
  503: { code: 503, message: 'Service Unavailable' },
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
    let result;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      result = {
        code: axiosError.response.status,
        message: axiosError.response.data,
        headers: axiosError.responseHeaders,
      };
    } else if (axiosError.request) {
      // The request was made but no response was received
      // `axiosError.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      [result] = [Adapter.errorCodes[503]];
    } else {
      // Client error.
      result = { code: 0, message: axiosError.message };
    }
    return new Error(JSON.stringify(result));
  }
}
export default {
  axios: AxiosAdapter,
};
