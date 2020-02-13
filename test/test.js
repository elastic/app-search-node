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

const assert = require('assert')
const AppSearchClient = require('../lib/appSearch')
const replay = require('replay')

describe('AppSearchClient', () => {
  const hostIdentifier = process.env.HOST_IDENTIFIER || 'host-c5s2mj'
  const apiKey = process.env.API_KEY || 'api-mu75psc5egt9ppzuycnc2mc3'
  const client = new AppSearchClient(hostIdentifier, apiKey)

  replay.reset('localhost') // So that replay can capture localhost requests
  const baseUrlFn = () => "http://localhost:3002/api/as/v1/";
  const selfManagedClient = new AppSearchClient(undefined, apiKey, baseUrlFn)

  const engineName = 'swiftype-api-example'
  const documents = [
    {
      id: 'INscMGmhmX4',
      url: 'http://www.youtube.com/watch?v=v1uyQZNg2vE',
      title: 'The Original Grumpy Cat',
      body: 'this is a test'
    },
    {
      id: 'JNDFojsd02',
      url: 'http://www.youtube.com/watch?v=tsdfhk2j',
      title: 'Another Grumpy Cat',
      body: 'this is also a test'
    }
  ]
  const curations = [
    {
      "id": "cur-9382",
      "queries": [
        "mew hiss"
      ],
      "promoted": [
        "INscMGmhmX4"
      ],
      "hidden": [
        "JNDFojsd02"
      ]
    },
    {
      "id": "cur-378291",
      "queries": [
        "grrr scratch"
      ],
      "promoted": [
        "JNDFojsd02"
      ],
      "hidden": [
        "INscMGmhmX4"
      ]
    }
  ]

  describe('#indexDocument', () => {
    it('should index a document successfully', (done) => {
      client.indexDocument(engineName, documents[0])
      .then((result) => {
        assert.deepEqual({ 'id': 'INscMGmhmX4' }, result)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#indexDocuments', () => {
    it('should index documents successfully', (done) => {
      client.indexDocuments(engineName, documents)
      .then((results) => {
        assert.deepEqual([
          { 'errors': [], 'id': 'INscMGmhmX4' },
          { 'errors': [], 'id': 'JNDFojsd02' }
        ], results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#getDocuments', () => {
    const documentIds = documents.map((d) => d.id)

    it('should get documents successfully', (done) => {
      client.getDocuments(engineName, documentIds)
      .then((results) => {
        assert.deepEqual([
          {
            'body': 'this is a test',
            'id': 'INscMGmhmX4',
            'title': 'The Original Grumpy Cat',
            'url': 'http://www.youtube.com/watch?v=v1uyQZNg2vE',
          },
          {
            'body': 'this is also a test',
            'id': 'JNDFojsd02',
            'title': 'Another Grumpy Cat',
            'url': 'http://www.youtube.com/watch?v=tsdfhk2j',
          }
        ], results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#destroyDocuments', () => {
    it('should destroy documents', (done) => {
      client.destroyDocuments(engineName, ['INscMGmhmX4', 'FakeId'])
      .then((results) => {
        assert.deepEqual([
          { 'id': 'INscMGmhmX4', 'deleted': true, 'result': true },
          { 'id': 'FakeId', 'deleted': false, 'result': false },
        ], results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#listEngines', () => {
    it('should list engines successfully', (done) => {
      client.listEngines()
      .then((results) => {
        assert.deepEqual({
          'meta': {
            'page': {
              'current': 1,
              'total_pages': 1,
              'total_results': 3,
              'size': 25
            }
          },
          'results': [{
            'name': 'node-modules',
            'type': 'default',
            'language': null
          }, {
            'name': 'ruby-gems',
            'type': 'default',
            'language': null
          }, {
            'name': 'test-engine',
            'type': 'default',
            'language': null
          }]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })

    it('should support paging', (done) => {
      client.listEngines({
        page: {
          current: 2,
          size: 1
        }
      })
      .then((results) => {
        assert.deepEqual({
          'meta': {
            'page': {
              'current': 2,
              'total_pages': 3,
              'total_results': 3,
              'size': 1
            }
          },
          'results': [{
            'name': 'ruby-gems',
            'type': 'default',
            'language': null
          }]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#getEngine', () => {
    it('should get an engine successfully', (done) => {
      client.getEngine(engineName)
      .then((results) => {
        assert.deepEqual({
          'name': 'swiftype-api-example',
          'type': 'default',
          'language': null
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#createEngine', () => {
    it('should create an engine successfully', (done) => {
      client.createEngine('new-engine')
      .then((results) => {
        assert.deepEqual({
          'name': 'new-engine',
          'type': 'default',
          'language': null
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })

    it('should create an engine with a language', (done) => {
      client.createEngine('new-engine', {language: 'en'})
      .then((results) => {
        assert.deepEqual({
          'name': 'new-engine',
          'type': 'default',
          'language': 'en'
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#destroyEngine', () => {
    it('should delete an engine successfully', (done) => {
      client.destroyEngine('new-engine')
      .then((results) => {
        assert.deepEqual({
          'deleted': true
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#createMetaEngine', () => {
    it('should create a meta engine', (done) => {
      selfManagedClient.createMetaEngine('new-meta-engine', ['source-engine-1', 'source-engine-2'])
      .then((results) => {
        assert.deepEqual({
          'name': 'new-meta-engine',
          'type': 'meta',
          'source_engines': [
            'source-engine-1',
            'source-engine-2'
          ]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#addMetaEngineSources', () => {
    it('should add a Source Engine to a Meta Engine', (done) => {
      selfManagedClient.addMetaEngineSources('new-meta-engine', ['source-engine-3'])
      .then((results) => {
        assert.deepEqual({
          'name': 'new-meta-engine',
          'type': 'meta',
          'source_engines': [
            'source-engine-1',
            'source-engine-2',
            'source-engine-3'
          ]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#deleteMetaEngineSources', () => {
    it('Remove a Source Engine from a Meta Engine', (done) => {
      selfManagedClient.deleteMetaEngineSources('new-meta-engine', ['source-engine-3'])
      .then((results) => {
        assert.deepEqual({
          'name': 'new-meta-engine',
          'type': 'meta',
          'source_engines': [
            'source-engine-1',
            'source-engine-2'
          ]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#search', () => {
    it('should query', (done) => {
      client.search(engineName, 'cat')
      .then((resp) => {
        assert.deepEqual([
          { raw: 'The Original Grumpy Cat' },
          { raw: 'Another Grumpy Cat' }
        ], resp.results.map((r) => r.title ))
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#multiSearch', () => {
    it('should query', (done) => {
      client.multiSearch(engineName, [{
        query: 'cat',
        options: {}
      }, {
        query: 'grumpy',
        options: {}
      }])
        .then((resp) => {
          assert.deepEqual(resp.map(res => res.results.map(res => res.title.raw)), [[
              'The Original Grumpy Cat',
              'Another Grumpy Cat'
            ], [
              'Another Grumpy Cat',
              'The Original Grumpy Cat'
            ]
          ])
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('#querySuggestion', () => {
    it('should request query suggestions', (done) => {
      client.querySuggestion(engineName, 'cat')
        .then((resp) => {
          assert.deepEqual({
            results: { documents: [{ suggestion: "cat" }] },
            meta: { request_id: "7414beb06c644b1aa88accb6019c6d6f" }
          }, resp)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

    it('should request query suggestions with options', (done) => {
      client.querySuggestion(engineName, 'cat', {
          size: 3,
          types: {
            documents: {
              fields: ['title']
            }
          }
        })
        .then((resp) => {
          assert.deepEqual({
            results: { documents: [{ suggestion: "cat" }] },
            meta: { request_id: "a0e24c46d4379e58bf871a6a515b8d94" }
          }, resp)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('#createSignedSearchKey', () => {
    it('should build a valid jwt', (done) => {
      token = AppSearchClient.createSignedSearchKey('private-mu75psc5egt9ppzuycnc2mc3', 'my-token-name', { query: 'cat' })
      jwt = require('jsonwebtoken')
      decoded = jwt.verify(token, 'private-mu75psc5egt9ppzuycnc2mc3')
      assert.equal(decoded.api_key_name, 'my-token-name')
      assert.equal(decoded.query, 'cat')
      done()
    })
  })

  describe('#listCurations', () => {
    it('should list curations successfully', (done) => {
      client.listCurations(engineName)
      .then((results) => {
        assert.deepEqual({
          "meta": {
            "page": {
              "current": 1,
              "total_pages": 1,
              "total_results": 2,
              "size": 25
            }
          },
          "results": curations
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })

    it('should support paging', (done) => {
      client.listCurations(engineName, {
        page: {
          current: 2,
          size: 1
        }
      })
      .then((results) => {
        assert.deepEqual({
          "meta": {
            "page": {
              "current": 2,
              "total_pages": 2,
              "total_results": 2,
              "size": 1
            }
          },
          "results": [
            curations[1]
          ]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#getCuration', () => {
    it('should get a curation successfully', (done) => {
      const expected = {
        meta: {
          page: { current: 1, total_pages: 1, total_results: 1, size: 25 }
        },
        results:
         [ curations[0] ]
       }
      client.getCuration(engineName, curations[0].id)
      .then((results) => {
        assert.deepEqual(expected, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })

    it('passes along errors', (done) => {
      client.getCuration(engineName, "cur-0000")
      .then((results) => {
        done(new Error('This should have resulted in an error'))
      })
      .catch((error) => {
        assert(error.errorMessages.join().toString() === "Curation not found with id: cur-0000")
        done()
      })
    })
  })

  describe('#createCuration', () => {
    it('should create a curation successfully', (done) => {
      client.createCuration(engineName, {queries: ["arf arf"], promoted: [], hidden: ["INscMGmhmX4", "JNDFojsd02"]})
      .then((results) => {
        assert.deepEqual({
          "id": "cur-9043829"
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#destroyCuration', () => {
    it('should delete a curation successfully', (done) => {
      client.destroyCuration(engineName, curations[1].id)
      .then((results) => {
        assert.deepEqual({
          "deleted": true
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('#updateCuration', () => {
    it('should update a curation successfully', (done) => {
      client.updateCuration(engineName, "cur-9382", {queries: ["mew hiss", "sideways hop"], promoted: ["INscMGmhmX4"], hidden: ["JNDFojsd02"]})
      .then((results) => {
        assert.deepEqual({
          "id": "cur-9382"
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })
  })

  describe('error handling', () => {
    it('should handle 404', (done) => {
      client.search('invalid-engine-name', 'cat')
        .then(() => {
          done(new Error('was expected to throw with an error message'))
        })
        .catch(error => {
          const errorMessages = (error && error.errorMessages) ? error.errorMessages : null

          if (errorMessages) {
            try {
              assert.deepEqual(errorMessages, ['Could not find engine.'])
              done()
            } catch (e) {
              done(e)
            }
          } else {
            done(error)
          }
        })
    })

    it('should handle auth error', (done) => {
      const badAuthClient = new AppSearchClient(hostIdentifier, 'invalid')
      badAuthClient.search(engineName, 'cat')
      .then(() => {
        done(new Error('was expected to throw with an error message'))
      })
      .catch(error => {
        const errorMessages = (error && error.errorMessages) ? error.errorMessages : null

        if (errorMessages) {
          try {
            assert.deepEqual(errorMessages, ['Invalid authentication token.'])
            done()
          } catch (e) {
            done(e)
          }
        } else {
          done(error)
        }
      })
    })

    it('should handle multi_search errors', (done) => {
      client.multiSearch(engineName, [
        {
          query: 'cat',
          options: {
            badField: 'whatever'
          }
        }, {
          query: 'grumpy',
          options: {}
        }
      ])
      .then(() => {
        done(new Error('was expected to throw with an error message'))
      })
      .catch(error => {
        const errorMessages = (error && error.errorMessages) ? error.errorMessages : null

        if (errorMessages) {
          try {
            assert.deepEqual(errorMessages, ['Options contains invalid key: badField'])
            done()
          } catch (e) {
            done(e)
          }
        } else {
          done(error)
        }
      })
    })
  })
})
