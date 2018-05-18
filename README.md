# Node client for the Swiftype App Search Api

## Installation

To install this package, execute:

    npm install swiftype-app-search-node

## Usage

### Setup: Configuring the client and authentication

Create a new instance of the Swiftype App Search Client. This requires your ACCOUNT_HOST_KEY, which identifies the unique hostname of the Swiftype API that is associated with your Swiftype account. It also requires a valid API_KEY, which authenticates requests to the API:

    const SwiftypeAppSearchClient = require('swiftype-app-search-node')
    const accountHostKey = 'host-c5s2mj'
    const apiKey = 'api-mu75psc5egt9ppzuycnc2mc3'
    const client = new SwiftypeAppSearchClient(accountHostKey, apiKey)

### API Methods

This client is a thin interface to the Swiftype App Search Api. Additional details for requests and responses can be
found in the [documentation](https://swiftype.com/documentation/app-search).

##### Indexing: Creating and updating Documents

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
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Retrieving Documents

    engineName = 'favorite-videos'
    documentIds = ['INscMGmhmX4', 'JNDFojsd02']

    client.getDocuments(engineName, documentIds)
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Destroying Documents

    engineName = 'favorite-videos'
    documentIds = ['INscMGmhmX4', 'JNDFojsd02']

    client.destroyDocuments(engineName, documentIds)
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Listing Engines

    client.listEngines({page: {size: 10, current: 1}})
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Retrieving Engines

    engineName = 'favorite-videos'
    client.getEngine(engineName)
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Creating Engines

    engineName = 'favorite-videos'
    client.createEngine(engineName)
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Destroying Engines

    engineName = 'favorite-videos'
    client.destroyEngine(engineName)
    .then(response => console.log(response))
    .catch(error => console.log(error))

##### Searching

    engineName = 'favorite-videos'
    query = 'cat'
    searchFields = { title: {} }
    resultFields = { title: { raw: {} } }
    options = { search_fields: searchFields, result_fields: resultFields }

    client.search(engineName, query, options)
    .then(response => console.log(response))
    .catch(error => console.log(error))


## Running Tests

    $ npm test

## Contributions

  To contribute code, please fork the repository and submit a pull request.
