# Node client for the Swiftype App Search Api

[![CircleCI](https://circleci.com/gh/swiftype/swiftype-app-search-node.svg?style=svg)](https://circleci.com/gh/swiftype/swiftype-app-search-node)

## Installation

To install this package, execute:

    npm install swiftype-app-search-node

## Usage

### Setup: Configuring the client and authentication

Using this client assumes that you have already created an [App Search](https://swiftype.com/app-search) account, and subsequently created an Engine. You'll need to configure the client with the name of your Engine and your authentication credentials, which can be found [here] (https://app.swiftype.com/as/credentials).

- hostIdentifier -> Your **Host Identifier**, should start with `host-`
- apiKey -> Your **API Key**. You can use any key type with the client, however each has a different scope. For more information on keys, check out the [documentation](https://swiftype.com/documentation/app-search/credentials).

```javascript
const SwiftypeAppSearchClient = require('swiftype-app-search-node')
const hostIdentifier = 'host-c5s2mj'
const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const client = new SwiftypeAppSearchClient(hostIdentifier, privateKey)
```

### Using with App Search Managed Deploys

 The client can be configured to use a managed deploy by using the
`baseUrlFn` parameter. Since managed deploys do not rely on a `hostIdentifier`.
, it can be omitted.

 ```javascript
const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
const client = new SwiftypeAppSearchClient(undefined, apiKey, baseUrlFn)
```

### API Methods

This client is a thin interface to the Swiftype App Search Api. Additional details for requests and responses can be
found in the [documentation](https://swiftype.com/documentation/app-search).

##### Indexing: Creating and updating Documents

```javascript
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

client
  .indexDocuments(engineName, documents)
  .then(response => console.log(response))
  .catch(error => console.log(error))
```

##### Retrieving Documents

```javascript
const engineName = 'favorite-videos'
const documentIds = ['INscMGmhmX4', 'JNDFojsd02']

client
  .getDocuments(engineName, documentIds)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Destroying Documents

```javascript
const engineName = 'favorite-videos'
const documentIds = ['INscMGmhmX4', 'JNDFojsd02']

client
  .destroyDocuments(engineName, documentIds)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Listing Engines

```javascript
client
  .listEngines({ page: { size: 10, current: 1 } })
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Retrieving Engines

```javascript
const engineName = 'favorite-videos'

client
  .getEngine(engineName)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Creating Engines

```javascript
const engineName = 'favorite-videos'

client
  .createEngine(engineName)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Destroying Engines

```javascript
const engineName = 'favorite-videos'

client
  .destroyEngine(engineName)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Searching

```javascript
const engineName = 'favorite-videos'
const query = 'cat'
const searchFields = { title: {} }
const resultFields = { title: { raw: {} } }
const options = { search_fields: searchFields, result_fields: resultFields }

client
  .search(engineName, query, options)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Multi-Search

```javascript
engineName = 'favorite-videos'
searches = [
  { query: 'cat', options: {
      search_fields: { title: {} },
      result_fields: { title: { raw: {} } }
  } },
  { query: 'grumpy', options: {} }
]

client
  .multiSearch(engineName, searches)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

## Running Tests

    $ npm test

## Adding and updating tests

The specs in this project use [node-replay](https://github.com/assaf/node-replay) to capture responses.

To capture new responses, run tests with the following commands:

```
nvm use // Be sure to use the correct version of node
REPLAY=record npm test
```

## Contributions

  To contribute code, please fork the repository and submit a pull request.
