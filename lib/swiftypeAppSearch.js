const Client = require('./client')
const jwt = require('jsonwebtoken')

const SIGNED_SEARCH_TOKEN_JWT_ALGORITHM = 'HS256'

const DEFAULT_BASE_URL_FN = (accountHostKey) => {
  return `https://${accountHostKey}.api.swiftype.com/api/as/v1/`
}

class SwiftypeAppSearchClient {
  constructor(accountHostKey, apiKey, baseUrlFn = DEFAULT_BASE_URL_FN) {
    const baseUrl = baseUrlFn(accountHostKey)
    this.client = new Client(apiKey, baseUrl)
  }

  /**
   * Send a search request to the Swiftype App Search Api
   * https://swiftype.com/documentation/app-search/
   *
   * @param {String} engineName unique Engine name
   * @param {String} query String that is used to perform a search request.
   * @param {Object} options Object used for configuring the search like search_fields and result_fields
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  search(engineName, query, options = {}) {
    options = Object.assign({}, options, { query })
    return this.client.get(`engines/${encodeURIComponent(engineName)}/search`, options)
  }

  /**
   * Index a document.
   *
   * @param {String} engineName unique Engine name
   * @param {Object} document document object to be indexed.
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  indexDocument(engineName, document) {
    return this.indexDocuments(engineName, [document])
      .then((processedDocumentResults) => {
        return new Promise((resolve, reject) => {

          const processedDocumentResult = processedDocumentResults[0]
          const errors = processedDocumentResult['errors']
          if (errors.length) {
            reject(new Error(errors.join('; ')))
          }
          delete processedDocumentResult['errors']
          resolve(processedDocumentResult)
        })
      })
  }

  /**
   * Index a batch of documents.
   *
   * @param {String} engineName unique Engine name
   * @param {Array<Object>} documents Array of document objects to be indexed.
   * @returns {Promise<Array<Object>>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  indexDocuments(engineName, documents) {
    return this.client.post(`engines/${encodeURIComponent(engineName)}/documents`, documents)
  }

  /**
   * Retrieve a batch of documents.
   *
   * @param {String} engineName unique Engine name
   * @param {Array<String>} ids Array of document ids to be retrieved
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  getDocuments(engineName, ids) {
    return this.client.get(`engines/${encodeURIComponent(engineName)}/documents`, ids)
  }

  /**
   * Destroy a batch of documents.
   *
   * @param {String} engineName unique Engine name
   * @param {Array<String>} ids Array of document ids to be destroyed
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  destroyDocuments(engineName, ids) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}/documents`, ids)
  }

  /**
   * Creates a jwt search key that can be used for authentication to enforce a set of required search options.
   *
   * @param {String} apiKey the API Key used to sign the search key
   * @param {String} apiKeyId the unique API Key identifier
   * @param {Object} options Object see the <a href="https://swiftype.com/documentation/app-search/">App Search API</a> for supported search options
   * @returns {String} jwt search key
   */
  static createSignedSearchKey(apiKey, apiKeyId, options = {}) {
    if (!apiKey.match(/^api/)) {
      throw new Error('Must sign search options with an API Key, cannot use a search-only API Key')
    }
    const payload = Object.assign({}, options, { api_key_id: apiKeyId })
    return jwt.sign(payload, apiKey, { algorithm: SIGNED_SEARCH_TOKEN_JWT_ALGORITHM })
  }
}

module.exports = SwiftypeAppSearchClient
