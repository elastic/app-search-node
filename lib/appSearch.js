/*

Copyright 2019 Elastic and contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

const Client = require('./client')
const jwt = require('jsonwebtoken')

const SIGNED_SEARCH_TOKEN_JWT_ALGORITHM = 'HS256'

const DEFAULT_BASE_URL_FN = (accountHostKey) => {
  return `https://${accountHostKey}.api.swiftype.com/api/as/v1/`
}

/**
 * Takes a paging object in the format {current, page} and converts it to an array of query string parameters, like
 * ['page[current]=1', 'page[size]=10']
 */
function buildPagingParams(options) {
  return Object.keys(options).map(key => {
    const value = options[key]
    if (!value) return null
    return `page[${key}]=${value}`
  }).filter(v => v)
}

class AppSearchClient {
  constructor(accountHostKey, apiKey, baseUrlFn = DEFAULT_BASE_URL_FN) {
    const baseUrl = baseUrlFn(accountHostKey)
    this.client = new Client(apiKey, baseUrl)
  }

  /**
   * Send a search request to the App Search Api
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
   * Run multiple searches for documents on a single request
   *
   * @param {String} engineName unique Engine name
   * @param {Array} searches Searches to execute, [{query: String, options: Object}]
   * @returns {Promise<Object>} a Promise that returns an array of results {Object} when resolved, otherwise throws an Error.
   */
  multiSearch(engineName, searches) {
    searches = searches.map(search => {
      return Object.assign({}, search.options, { query: search.query })
    })

    return this.client.post(`engines/${encodeURIComponent(engineName)}/multi_search`, {
      queries: searches
    })
  }

  /**
   * Sends a query suggestion request to the App Search Api
   *
   * @param {String} engineName unique Engine name
   * @param {String} query String that is used to perform a query suggestion request.
   * @param {Object} options Object used for configuring the request
   */
  querySuggestion(engineName, query, options = {}) {
    options = Object.assign({}, options, { query })
    return this.client.post(`engines/${encodeURIComponent(engineName)}/query_suggestion`, options)
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
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error. Includes "result" keys to maintain backward compatibility.
   */
  destroyDocuments(engineName, ids) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}/documents`, ids)
    .then((response) => {
      response.forEach((docResult)=>{
        docResult.result = docResult.deleted
      })
        return response
      })
  }


  /**
   * List all engines
   *
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  listEngines(options = {}) {
    const pagingParams = buildPagingParams(options.page || {})
    const prefix = pagingParams.length ? '?' : ''

    return this.client.get(`engines${prefix}${pagingParams.join('&')}`, {})
  }

  /**
   * Retrieve an engine by name
   *
   * @param {String} engineName unique Engine name
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  getEngine(engineName) {
    return this.client.get(`engines/${encodeURIComponent(engineName)}`, {})
  }

  /**
   * Create a new engine
   *
   * @param {String} engineName unique Engine name
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  createEngine(engineName) {
    return this.client.post(`engines`, {
      name: engineName
    })
  }

  /**
   * Delete an engine
   *
   * @param {String} engineName unique Engine name
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  destroyEngine(engineName) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}`, {})
  }


  /**
   * List all Curations
   *
   * @param {String} engineName unique Engine name
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  listCurations(engineName, options = {}) {
    const pagingParams = buildPagingParams(options.page || {});
    const prefix = pagingParams.length ? '?' : '';

    return this.client.get(`engines/${encodeURIComponent(engineName)}/curations${prefix}${pagingParams.join('&')}`, {})
  }

  /**
   * Retrieve a Curation by id
   *
   * @param {String} engineName unique Engine name
   * @param {String} curationId unique Curation id
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  getCuration(engineName, curationId) {

    return this.client.get(`engines/${encodeURIComponent(engineName)}/curations/${encodeURIComponent(curationId)}`, {})
  }

  /**
   * Create a new Curation
   *
   * @param {String} engineName unique Engine name
   * @param {Object} newCuration body of the Curation object
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  createCuration(engineName, newCuration) {
    return this.client.post(`engines/${encodeURIComponent(engineName)}/curations`, newCuration)
  }

  /**
   * Update an existing curation
   *
   * @param {String} engineName unique Engine name
   * @param {String} curationId unique Curation id
   * @param {Object} newCuration body of the Curation object
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  updateCuration(engineName, curationId, newCuration) {
    return this.client.put(`engines/${encodeURIComponent(engineName)}/curations/${encodeURIComponent(curationId)}`, newCuration)
  }

  /**
   * Delete a curation
   *
   * @param {String} engineName unique Engine name
   * @param {String} curationId unique Curation name
   * @returns {Promise<Object>} a Promise that returns a result {Object} when resolved, otherwise throws an Error.
   */
  destroyCuration(engineName, curationId) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}/curations/${encodeURIComponent(curationId)}`, {})
  }


  /**
   * Creates a jwt search key that can be used for authentication to enforce a set of required search options.
   *
   * @param {String} apiKey the API Key used to sign the search key
   * @param {String} apiKeyName the unique name for the API Key
   * @param {Object} options Object see the <a href="https://swiftype.com/documentation/app-search/">App Search API</a> for supported search options
   * @returns {String} jwt search key
   */
  static createSignedSearchKey(apiKey, apiKeyName, options = {}) {
    const payload = Object.assign({}, options, { api_key_name: apiKeyName })
    return jwt.sign(payload, apiKey, { algorithm: SIGNED_SEARCH_TOKEN_JWT_ALGORITHM })
  }
}

module.exports = AppSearchClient
