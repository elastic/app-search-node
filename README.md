<p align="center"><img src="https://github.com/swiftype/swiftype-app-search-node/blob/master/logo-app-search.png?raw=true" alt="Elastic App Search Logo"></p>

<p align="center"><a href="https://circleci.com/gh/swiftype/swiftype-app-search-node"><img src="https://circleci.com/gh/swiftype/swiftype-app-search-node.svg?style=svg" alt="CircleCI buidl"></a>
<a href="https://github.com/swiftype/swiftype-app-search-node/releases"><img src="https://img.shields.io/github/release/swiftype/swiftype-app-search-node/all.svg?style=flat-square" alt="GitHub release" /></a></p>

> A first-party Node.JS client for building excellent, relevant search experiences with [Elastic App Search](https://www.elastic.co/cloud/app-search-service).

## Contents

- [Getting started](#getting-started-)
- [Usage](#usage)
- [Running tests](#running-tests)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## Getting started 🐣

To install this package, run:

```bash
npm install swiftype-app-search-node
```

## Usage

### Setup: Configuring the client and authentication

Using this client assumes that you have already created an [App Search](https://swiftype.com/app-search) account, and subsequently created an Engine. You'll need to configure the client with the name of your Engine and your [authentication credentials](https://app.swiftype.com/as/credentials).

- hostIdentifier -> Your **Host Identifier**, should start with `host-`
- apiKey -> Your **API Key**. You can use any key type with the client, however each has a different scope. For more information on keys, check out the [documentation](https://swiftype.com/documentation/app-search/credentials).

```javascript
const SwiftypeAppSearchClient = require('swiftype-app-search-node')
const hostIdentifier = 'host-c5s2mj'
const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const client = new SwiftypeAppSearchClient(hostIdentifier, apiKey)
```

### Using with App Search Managed Deploys

 The client can be configured to use a managed deploy by using the `baseUrlFn` parameter. Since managed deploys do not rely on a `hostIdentifier`, it can be omitted.

 ```javascript
const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
const client = new SwiftypeAppSearchClient(undefined, apiKey, baseUrlFn)
```

### API Methods

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
const engineName = 'favorite-videos'
const searches = [
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

##### Query Suggestion

```javascript
const engineName = 'favorite-videos'
const options = {
  size: 3,
  types: {
    documents: {
      fields: ['title']
    }
  }
}

client
  .querySuggestion(engineName, 'cat', options)
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Listing Curations

```javascript
const engineName = 'favorite-videos'

client
  .listCurations(engineName) 
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
  
// Pagination details are optional  
const paginationDetails = {
        page: {
          current: 2,
          size: 10
        }
      }

client
  .listCurations(engineName, paginationDetails) 
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Retrieving Curations

```javascript
const engineName = 'favorite-videos'
const curationId = 'cur-7438290'

client
  .getCuration(engineName, curationId) 
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Creating Curations

```javascript
const engineName = 'favorite-videos'
const newCuration = {
  queries: ['cat blop'], 
  promoted: ['Jdas78932'], 
  hidden: ['INscMGmhmX4', 'JNDFojsd02']
}

client
  .createCuration(engineName, newCuration) 
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Updating Curations

```javascript
const engineName = 'favorite-videos'
const curationId = 'cur-7438290'
// "queries" is required, either "promoted" or "hidden" is required. 
// Values sent for all fields will overwrite existing values. 
const newDetails = {
  queries: ['cat blop'], 
  promoted: ['Jdas78932', 'JFayf782']
}

client
  .updateCuration(engineName, curationId, newDetails) 
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Deleting Curations

```javascript
const engineName = 'favorite-videos'
const curationId = 'cur-7438290'

client
  .destroyCuration(engineName, curationId) 
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

## Running tests

The specs in this project use [node-replay](https://github.com/assaf/node-replay) to capture responses.

To capture new responses, run tests with the following commands:

```bash
nvm use
REPLAY=record npm test
```

Otherwise:

```bash
npm test
```

## FAQ 🔮

### Where do I report issues with the client?

If something is not working as expected, please open an [issue](https://github.com/swiftype/swiftype-app-search-node/issues/new).

### Where can I learn more about App Search?

Your best bet is to read the [documentation](https://swiftype.com/documentation/app-search).

### Where else can I go to get help?

You can checkout the [Elastic App Search community discuss forums](https://discuss.elastic.co/c/app-search).

## Contribute 🚀

We welcome contributors to the project. Before you begin, a couple notes...

- Prior to opening a pull request, please create an issue to [discuss the scope of your proposal](https://github.com/swiftype/swiftype-app-search-node/issues).
- Please write simple code and concise documentation, when appropriate.

## License 📗

[MIT](https://github.com/swiftype/swiftype-app-search-node/blob/master/LICENSE) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/swiftype/swiftype-app-search-node/graphs/contributors)!
