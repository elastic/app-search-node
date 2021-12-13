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

  search(engineName, query, options = {}) {
    options = Object.assign({}, options, { query })
    return this.client.get(`engines/${encodeURIComponent(engineName)}/search`, options)
  }

  multiSearch(engineName, searches) {
    searches = searches.map(search => {
      return Object.assign({}, search.options, { query: search.query })
    })

    return this.client.post(`engines/${encodeURIComponent(engineName)}/multi_search`, {
      queries: searches
    })
  }

  querySuggestion(engineName, query, options = {}) {
    options = Object.assign({}, options, { query })
    return this.client.post(`engines/${encodeURIComponent(engineName)}/query_suggestion`, options)
  }

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

  indexDocuments(engineName, documents) {
    return this.client.post(`engines/${encodeURIComponent(engineName)}/documents`, documents)
  }

  updateDocuments(engineName, documents) {
    return this.client.patch(`engines/${encodeURIComponent(engineName)}/documents`, documents)
  }

  listDocuments(engineName, options = {}) {
    const pagingParams = buildPagingParams(options.page || {})
    const prefix = pagingParams.length ? '?' : ''

    return this.client.get(`engines/${encodeURIComponent(engineName)}/documents/list${prefix}${pagingParams.join('&')}`, {})
  }

  getDocuments(engineName, ids) {
    return this.client.get(`engines/${encodeURIComponent(engineName)}/documents`, ids)
  }

  destroyDocuments(engineName, ids) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}/documents`, ids)
    .then((response) => {
      response.forEach((docResult)=>{
        docResult.result = docResult.deleted
      })
        return response
      })
  }

  listEngines(options = {}) {
    const pagingParams = buildPagingParams(options.page || {})
    const prefix = pagingParams.length ? '?' : ''

    return this.client.get(`engines${prefix}${pagingParams.join('&')}`, {})
  }

  getEngine(engineName) {
    return this.client.get(`engines/${encodeURIComponent(engineName)}`, {})
  }

  createEngine(engineName, options) {
    return this.client.post(`engines`, {
      name: engineName,
      ...options
    })
  }

  addMetaEngineSources(engineName, sourceEngines) {
    return this.client.post(`engines/${engineName}/source_engines`, sourceEngines)
  }

  deleteMetaEngineSources(engineName, sourceEngines) {
    return this.client.delete(`engines/${engineName}/source_engines`, sourceEngines)
  }

  destroyEngine(engineName) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}`, {})
  }

  listCurations(engineName, options = {}) {
    const pagingParams = buildPagingParams(options.page || {});
    const prefix = pagingParams.length ? '?' : '';

    return this.client.get(`engines/${encodeURIComponent(engineName)}/curations${prefix}${pagingParams.join('&')}`, {})
  }

  getCuration(engineName, curationId) {
    return this.client.get(`engines/${encodeURIComponent(engineName)}/curations/${encodeURIComponent(curationId)}`, {})
  }

  createCuration(engineName, newCuration) {
    return this.client.post(`engines/${encodeURIComponent(engineName)}/curations`, newCuration)
  }

  updateCuration(engineName, curationId, newCuration) {
    return this.client.put(`engines/${encodeURIComponent(engineName)}/curations/${encodeURIComponent(curationId)}`, newCuration)
  }

  createMetaEngine(engineName, sourceEngines) {
    return this.client.post(`engines`, {
      name: engineName,
      type: 'meta',
      source_engines: sourceEngines
    })
  }

  destroyCuration(engineName, curationId) {
    return this.client.delete(`engines/${encodeURIComponent(engineName)}/curations/${encodeURIComponent(curationId)}`, {})
  }

  getSchema(engineName) {
    return this.client.get(`engines/${encodeURIComponent(engineName)}/schema`, {})
  }

  updateSchema(engineName, schema) {
    return this.client.post(`engines/${encodeURIComponent(engineName)}/schema`, schema)
  }

  static createSignedSearchKey(apiKey, apiKeyName, options = {}, signOptions = {}) {
    const payload = Object.assign({}, options, { api_key_name: apiKeyName })
    return jwt.sign(payload, apiKey, Object.assign({}, signOptions, { algorithm: SIGNED_SEARCH_TOKEN_JWT_ALGORITHM }))
  }
}

module.exports = AppSearchClient
