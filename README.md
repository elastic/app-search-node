# Node client for the Swiftype App Search Api

**Note: Swiftype App Search is currently in beta**

## Installation

To install the gem, execute:

    npm install swiftype-app-search-node

## Usage

### Setup: Configuring the client and authentication

Create a new instance of the Swiftype App Search Client. This requires your ACCOUNT_HOST_KEY, which identifies the unique hostname of the Swiftype API that is associated with your Swiftype account. It also requires a valid API_KEY, which authenticates requests to the API:

    const SwiftypeAppSearchClient = require('swiftype-app-search-node')
    const accountHostKey = 'host-c5s2mj'
    const apiKey = 'api-mu75psc5egt9ppzuycnc2mc3'
    const client = new SwiftypeAppSearchClient(accountHostKey, apiKey)

### Indexing: Creating and updating Documents

    const engineName = 'favorite-videos'
    const documents = [
      {
        id: 'INscMGmhmX4',
        url: 'https://www.youtube.com/watch?v=INscMGmhmX4',
        title: 'The Original Grumpy Cat',
        body: 'A wonderful video of a magnificent cat.'
      },
      {
        id: 'JNDFojsd02',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Another Grumpy Cat',
        body: 'A great video of another cool cat.'
      }
    ]


    client.indexDocuments(engineName, documents)
    .then((indexDocumentResults) => {
      // handle index document results
    })
    .catch((error) => {
      // handle error
    })

### Retrieving Documents

    engineName = 'favorite-videos'
    documentIds = ['INscMGmhmX4', 'JNDFojsd02']

    client.getDocuments(engineName, documentIds)
    .then((documentContents) => {
      // handle document contents
    })
    .catch((error) => {
      // handle error
    })

### Destroying Documents

    engineName = 'favorite-videos'
    documentIds = ['INscMGmhmX4', 'JNDFojsd02']

    client.destroyDocuments(engineName, documentIds)
    .then((destroyDocumentResults) => {
      // handle destroy document results
    })
    .catch((error) => {
      // handle error
    })

### Searching

    engineName = 'favorite-videos'
    query = 'cat'
    searchFields = { :title => {} }
    resultFields = { :title => { :raw => {} } }
    options = { search_fields: searchFields, result_fields: resultFields }

    client.search(engineName, query, options)
    .then((searchResults) => {
      // handle search results
    })
    .catch((error) => {
      // handle error
    })


## Running Tests

    $ npm test

## Contributions

  To contribute code to this gem, please fork the repository and submit a pull request.
