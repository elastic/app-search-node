const assert = require('assert')
const SwiftypeAppSearchClient = require('../lib/swiftypeAppSearch')
const replay = require('replay')

describe('SwiftypeAppSearchClient', () => {
  const accountHostKey = 'host-c5s2mj'
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

  const swiftype = new SwiftypeAppSearchClient(accountHostKey, apiKey)

  describe('#indexDocument', () => {
    it('should raise an error if the document does not have an id', (done) => {
      assert.throws(() => swiftype.indexDocument(engineName, { title: 'foo' },
        /missing required fields \(id\)/))
      done()
    })

    it('should index a document successfully', (done) => {
      swiftype.indexDocument(engineName, documents[0])
      .then((result) => {
        assert.deepEqual({ "id": "INscMGmhmX4" }, result)
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
          { "errors": [], "id": "INscMGmhmX4" },
          { "errors": [], "id": "JNDFojsd02" }
        ], results)
        done()
      })
      .catch((error) => {
        done(error)
      })
    })

    it('should raise an error if any document does not have an id', (done) => {
      assert.throws(() => {
        swiftype.indexDocuments(engineName, [
          { title: 'foo' }
        ])
      }, /missing required fields \(id\)/)
      done()
    })
  })

  describe('#getDocuments', () => {
    const documentIds = documents.map((d) => d.id)

    it('should get documents successfully', (done) => {
      swiftype.getDocuments(engineName, documentIds)
      .then((results) => {
        assert.deepEqual([
          {
            "body": "this is a test",
            "id": "INscMGmhmX4",
            "title": "The Original Grumpy Cat",
            "url": "http://www.youtube.com/watch?v=v1uyQZNg2vE",
          },
          {
            "body": "this is also a test",
            "id": "JNDFojsd02",
            "title": "Another Grumpy Cat",
            "url": "http://www.youtube.com/watch?v=tsdfhk2j",
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
      swiftype.destroyDocuments(engineName, ["INscMGmhmX4", "FakeId"])
      .then((results) => {
        assert.deepEqual([
          { "id": "INscMGmhmX4", "result": true },
          { "id": "FakeId", "result": false },
        ], results)
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

  describe('#createSignedSearchKey', () => {
    it('should build a valid jwt', (done) => {
      token = SwiftypeAppSearchClient.createSignedSearchKey('api-mu75psc5egt9ppzuycnc2mc3', 42, { query: 'cat' })
      jwt = require('jsonwebtoken')
      decoded = jwt.verify(token, 'api-mu75psc5egt9ppzuycnc2mc3')
      assert.equal(decoded.api_key_id, 42)
      assert.equal(decoded.query, 'cat')
      done()
    })
  })
})
