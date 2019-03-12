function _req(
  method,
  options = {},
  successInterceptor,
  failInterceptor,
  setTask
) {
  return new Promise((resolve, reject) => {
    const task = wx[method]({
      ...options,
      success(...args) {
        if (typeof successInterceptor === 'function') {
          return resolve(successInterceptor(...args));
        }
        resolve(...args);
      },
      fail(...args) {
        if (typeof failInterceptor === 'function') {
          return reject(failInterceptor(...args));
        }
        reject(...args);
      },
    });
    setTask(task);
  });
}

class _wxreq {
  _successInterceptor = null;
  _failInterceptor = null;
  _requestTask = null;
  _successDownloadFileInterceptor = null;
  _failDownloadFileInterceptor = null;
  _downloadTask = null;
  _successUploadFileInterceptor = null;
  _failUploadFileInterceptor = null;
  _uploadTask = null;

  constructor(options = {}) {
    this.defaultOptions = options;
    this.setUp();
  }

  create(options) {
    return new _wxreq(options);
  }

  setInterceptor(success, fail) {
    this._successInterceptor = success;
    this._failInterceptor = fail;
  }

  setDownloadFileInterceptor(success, fail) {
    this._successDownloadFileInterceptor = success;
    this._failDownloadFileInterceptor = fail;
  }

  setUploadFileInterceptor(success, fail) {
    this._successUploadFileInterceptor = success;
    this._failUploadFileInterceptor = fail;
  }

  setRequestTask = task => {
    this._requestTask = task;
  };

  setDownloadTask = task => {
    this._downloadTask = task;
  };

  setUploadTask = task => {
    this._uploadTask = task;
  };

  getRequestTask() {
    return this._requestTask;
  }

  getUploadTask() {
    return this._downloadTask;
  }

  getUploadTask() {
    return this._uploadTask;
  }

  optionsHandler(options) {
    const { defaultOptions } = this;
    const { baseUrl, header } = defaultOptions;

    if (baseUrl) options.url = baseUrl + url;
    if (header) {
      options.header = options.header || {};
      options.header = Object.assign({}, header, options.header);
    }

    return Object.assign({}, defaultOptions, options);
  }

  request(options = {}) {
    const { _successInterceptor, _failInterceptor, setRequestTask } = this;
    options = this.optionsHandler(options);
    return _req(
      'request',
      options,
      _successInterceptor,
      _failInterceptor,
      setRequestTask
    );
  }

  downloadFile(options) {
    const {
      _successDownloadFileInterceptor,
      _failDownloadFileInterceptor,
      setDownloadTask,
    } = this;
    options = this.optionsHandler(options);
    return _req(
      'downloadFile',
      options,
      _successDownloadFileInterceptor,
      _failDownloadFileInterceptor,
      setDownloadTask
    );
  }

  uploadFile(options) {
    const {
      _successUploadFileInterceptor,
      _failUploadFileInterceptor,
      setUploadTask,
    } = this;
    options = this.optionsHandler(options);
    return _req(
      'uploadFile',
      options,
      _successUploadFileInterceptor,
      _failUploadFileInterceptor,
      setUploadTask
    );
  }

  _request(url, options = {}) {
    return this.request({ ...options, url });
  }

  setUp() {
    [
      'get',
      'post',
      'put',
      'delete',
      'head',
      'options',
      'trace',
      'connect',
    ].forEach(method => {
      this[method] = _request;
    });
  }
}

export default new _wxreq();
