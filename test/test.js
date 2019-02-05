const assert = require('assert')
const SwiftypeAppSearchClient = require('../lib/swiftypeAppSearch')
const replay = require('replay')

describe('SwiftypeAppSearchClient', () => {
  const hostIdentifier = 'host-c5s2mj'
  const apiKey = 'api-mu75psc5egt9ppzuycnc2mc3'
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

  const swiftype = new SwiftypeAppSearchClient(hostIdentifier, apiKey)

  describe('#indexDocument', () => {
    it('should index a document successfully', (done) => {
      swiftype.indexDocument(engineName, documents[0])
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
      swiftype.indexDocuments(engineName, documents)
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
      swiftype.getDocuments(engineName, documentIds)
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
      swiftype.destroyDocuments(engineName, ['INscMGmhmX4', 'FakeId'])
      .then((results) => {
        assert.deepEqual([
          { 'id': 'INscMGmhmX4', 'result': true },
          { 'id': 'FakeId', 'result': false },
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
      swiftype.listEngines()
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
            'name': 'node-modules'
          }, {
            'name': 'ruby-gems'
          }, {
            'name': 'test-engine'
          }]
        }, results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })

    it('should support paging', (done) => {
      swiftype.listEngines({
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
            'name': 'ruby-gems'
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
      swiftype.getEngine(engineName)
      .then((results) => {
        assert.deepEqual({
          'name': 'swiftype-api-example'
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
      swiftype.createEngine('new-engine')
      .then((results) => {
        assert.deepEqual({
          'name': 'new-engine'
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
      swiftype.destroyEngine('new-engine')
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

  describe('#search', () => {
    it('should query', (done) => {
      swiftype.search(engineName, 'cat')
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
      swiftype.multiSearch(engineName, [{
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
      swiftype.querySuggestion(engineName, 'cat')
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
      swiftype.querySuggestion(engineName, 'cat', {
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
      token = SwiftypeAppSearchClient.createSignedSearchKey('private-mu75psc5egt9ppzuycnc2mc3', 'my-token-name', { query: 'cat' })
      jwt = require('jsonwebtoken')
      decoded = jwt.verify(token, 'private-mu75psc5egt9ppzuycnc2mc3')
      assert.equal(decoded.api_key_name, 'my-token-name')
      assert.equal(decoded.query, 'cat')
      done()
    })
  })

  describe('error handling', () => {
    it('should handle 404', (done) => {
      swiftype.search('invalid-engine-name', 'cat')
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
      const badAuthSwiftype = new SwiftypeAppSearchClient(hostIdentifier, 'invalid')
      badAuthSwiftype.search(engineName, 'cat')
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
      swiftype.multiSearch(engineName, [
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
