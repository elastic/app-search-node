const packageJson = require('../package.json')
const request = require('request')

class Client {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey
    this.userAgent = `${packageJson.name}/${packageJson.version}`
    this.baseUrl = baseUrl
  }

  get(path, params) {
    return this._jsonRequest('GET', path, params)
  }

  post(path, params) {
    return this._jsonRequest('POST', path, params)
  }

  delete(path, params) {
    return this._jsonRequest('DELETE', path, params)
  }

  _jsonRequest(method, path, params) {
    return this._wrap({
      method: method,
      url: `${this.baseUrl}${path}`,
      json: params,
      auth: {
        bearer: this.apiKey
      },
      headers: {
        'User-Agent': this.userAgent,
        'Content-Type': 'application/json'
      }
    })
  }

  _wrap(options) {
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          error.errorMessages = [error.message]
          reject(error)
        } else if (!(response.statusCode.toString().match(/2[\d]{2}/))) {
          var apiError = new Error(response.statusMessage)
          apiError.errorMessages = response.body.errors
          reject(apiError)
        } else {
          resolve(body)
        }
      })
    })
  }
}

module.exports = Client
