const packageJson = require('../package.json')
const request = require('request')

function getErrorMessages(responseBody) {
  // Some responses, like a 404 return an error array.
  if (responseBody.errors) {
    return responseBody.errors
  }

  // Other responses, like an Auth error, return a single
  // error.
  if (responseBody.error) {
    return [responseBody.error]
  }

  // Multi-search returns an array of responses, with error arrays.
  if (Array.isArray(responseBody)) {
    return responseBody.reduce((acc, response) => {
      const errors = (response && Array.isArray(response.errors))
        ? response.errors
        : []
      return [...acc, ...errors]
    }, [])
  }
}
class Client {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey
    this.clientName = packageJson.name
    this.clientVersion = packageJson.version
    this.baseUrl = baseUrl
  }

  get(path, params) {
    return this._jsonRequest('GET', path, params)
  }

  post(path, params) {
    return this._jsonRequest('POST', path, params)
  }
  
  put(path, params) {
    return this._jsonRequest('PUT', path, params)
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
        'X-Swiftype-Client': this.clientName,
        'X-Swiftype-Client-Version': this.clientVersion,
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
          apiError.errorMessages = getErrorMessages(response.body)
          reject(apiError)
        } else {
          resolve(body)
        }
      })
    })
  }
}

module.exports = Client
