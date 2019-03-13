
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
  tasks = {
    request: null,
    downloadFile: null,
    uploadFile: null
  }

  interceptors = {
    request: null,
    success: null,
    fail: null,
    requestDownloadFile: null,
    downloadFileSuccess: null,
    downloadFileFail: null,
    requestUploadFile: null,
    uploadFileSuccess: null,
    uploadFileFail: null,
  }

  constructor(options = {}) {
    this.defaultOptions = options;
    this.setUp();
  }

  create(options) {
    return new _wxreq(options);
  }

  setInterceptor(interceptors) {
    this.interceptors = interceptors
  }

  setRequestTask = task => {
    this.tasks.request = task
  }

  setUploadTask = task => {
    this.tasks.uploadFile = task
  }

  setDownloadTask = task => {
    this.tasks.downloadFile = task
  }

  getRequestTask() {
    return this.tasks.request;
  }

  getUploadTask() {
    return this.tasks.uploadFile;
  }

  getDownloadTask() {
    return this.tasks.downloadFile;
  }

  optionsHandler(options) {
    const { defaultOptions } = this;
    const { baseUrl, header } = defaultOptions;

    if (baseUrl) options.url = baseUrl + options.url;
    if (header) {
      options.header = options.header || {};
      options.header = Object.assign({}, header, options.header);
    }

    return Object.assign({}, defaultOptions, options);
  }

  request(options = {}) {
    const { interceptors, setRequestTask } = this;
    options = this.optionsHandler(options);

    if (typeof interceptors.request === 'function') {
      options = interceptors.request(options)
    }

    return _req(
      'request',
      options,
      interceptors.success,
      interceptors.fail,
      setRequestTask
    );
  }

  downloadFile(options) {
    const {
      interceptors,
      setDownloadTask,
    } = this;
    options = this.optionsHandler(options);

    if (typeof interceptors.requestDownloadFile === 'function') {
      options = interceptors.requestDownloadFile(options)
    }

    return _req(
      'downloadFile',
      options,
      interceptors.downloadFileSuccess,
      interceptors.downloadFileFail,
      setDownloadTask
    );
  }

  uploadFile(options) {
    const {
      interceptors,
      setUploadTask,
    } = this;
    options = this.optionsHandler(options);

    if (typeof interceptors.requestUploadFile === 'function') {
      options = interceptors.requestUploadFile(options)
    }

    return _req(
      'uploadFile',
      options,
      interceptors.uploadFileSuccess,
      interceptors.downloadFileFail,
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
      this[method] = this._request;
    });
  }
}

export default new _wxreq();
