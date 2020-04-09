<p align="center"><img src="https://github.com/elastic/app-search-node/blob/master/logo-app-search.png?raw=true" alt="Elastic App Search Logo"></p>

<p align="center"><a href="https://circleci.com/gh/elastic/app-search-node"><img src="https://circleci.com/gh/elastic/app-search-node.svg?style=svg" alt="CircleCI build"></a></p>

> A first-party Node.JS client for building excellent, relevant search experiences with [Elastic App Search](https://www.elastic.co/products/app-search).

## Contents

- [Getting started](#getting-started-)
- [Versioning](#versioning)
- [Usage](#usage)
- [Running tests](#running-tests)
- [FAQ](#faq-)
- [Contribute](#contribute-)
- [License](#license-)

---

## Getting started 🐣

To install this package, run:

```bash
npm install @elastic/app-search-node
```

## Versioning

This client is versioned and released alongside App Search.

To guarantee compatibility, use the most recent version of this library within the major version of the corresponding App Search implementation.

For example, for App Search `7.3`, use `7.3` of this library or above, but not `8.0`.

If you are using the [SaaS version available on swiftype.com](https://app.swiftype.com/as) of App Search, you should use the version 7.5.x of the client.

## Usage

### Setup: Configuring the client and authentication

Using this client assumes that you have already an instance of [Elastic App Search](https://www.elastic.co/products/app-search) up and running.

The client is configured using the `baseUrlFn` and `apiKey` parameters.

 ```javascript
const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
const client = new AppSearchClient(undefined, apiKey, baseUrlFn)
```

Note:

The `[apiKey]` authenticates requests to the API.
You can use any key type with the client, however each has a different scope.
For more information on keys, check out the [documentation](https://swiftype.com/documentation/app-search/api/credentials).

#### Swiftype.com App Search users:

When using the [SaaS version available on swiftype.com](https://app.swiftype.com/as) of App Search, you can configure the client using your `hostIdentifier` instead of the `baseUrlFn` parameter.
The `hostIdentifier` can be found within the [Credentials](https://app.swiftype.com/as#/credentials) menu.

```javascript
const AppSearchClient = require('@elastic/app-search-node')
const hostIdentifier = 'host-c5s2mj'
const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
const client = new AppSearchClient(hostIdentifier, apiKey)
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
  .createEngine(engineName, { language: 'en' })
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

##### Create a Signed Search Key

Creating a search key that will only return the title field.

```javascript
const publicSearchKey = 'search-xxxxxxxxxxxxxxxxxxxxxxxx'
const publicSearchKeyName = 'search-key'
const enforcedOptions = {
  result_fields: { title: { raw: {} } },
  filters: { world_heritage_site: 'true' }
}

const signedSearchKey = AppSearchClient.createSignedSearchKey(
  publicSearchKey,
  publicSearchKeyName,
  enforcedOptions
)

const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
const client = new AppSearchClient(undefined, signedSearchKey, baseUrlFn)

client.search('sample-engine', 'everglade')
```

##### Create a Meta Engine

```javascript
const engineName = 'my-meta-engine'

client
  .createMetaEngine(engineName, ['source-engine-1', 'source-engine-2'])
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Add a Source Engine to a Meta Engine

```javascript
const engineName = 'my-meta-engine'

client
  .addMetaEngineSources(engineName, ['source-engine-3'])
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Remove a Source Engine from a Meta Engine

```javascript
const engineName = 'my-meta-engine'

client
  .deleteMetaEngineSources(engineName, ['source-engine-3'])
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

##### Creating Engines

```javascript
const engineName = 'my-meta-engine'

client
  .createEngine(engineName, {
    type: 'meta',
    source_engines: ['source-engine-1', 'source-engine-2']
  })
  .then(response => console.log(response))
  .catch(error => console.log(error.errorMessages))
```

## Running tests

```bash
npm test
```

The specs in this project use [node-replay](https://github.com/assaf/node-replay) to capture fixtures.

New fixtures should be captured from a running instance of App Search.

To capture new fixtures, run a command like the following:

```
nvm use
HOST_IDENTIFIER=host-c5s2mj API_KEY=private-b94wtaoaym2ovdk5dohj3hrz REPLAY=record npm run test -- -g 'should create a meta engine'
```

To break that down a little...
- `HOST_IDENTIFIER` - Use this to override the fake value used in tests with an actual valid value for your App Search instance to record from
- `API_KEY` - Use this to override the fake value used in tests with an actual valid value for your App Search instance to record from
- `REPLAY=record` - Tells replay to record a new response if one doesn't already exist
- `npm run test` - Run the tests
- `-- -g 'should create a meta engine'` - Limit the tests to ONLY run the new test you've created, 'should create a meta engine' for example

This will create a new fixture, make sure you manually edit that fixture to replace the host identifier and api key
recorded in that fixture with the values the tests use.

You'll also need to make sure that fixture is located in the correctly named directory under `fixtures` according to the host that was used.

You'll know if something is not right because this will error when you run `npm run test` with an error like:
```
Error: POST https://host-c5s2mj.api.swiftype.com:443/api/as/v1/engines refused: not recording and no network access
```


## FAQ 🔮

### Where do I report issues with the client?

If something is not working as expected, please open an [issue](https://github.com/elastic/app-search-node/issues/new).

### Where can I learn more about App Search?

Your best bet is to read the [documentation](https://swiftype.com/documentation/app-search).

### Where else can I go to get help?

You can checkout the [Elastic App Search community discuss forums](https://discuss.elastic.co/c/app-search).

## Contribute 🚀

We welcome contributors to the project. Before you begin, a couple notes...

- Prior to opening a pull request, please create an issue to [discuss the scope of your proposal](https://github.com/elastic/app-search-node/issues).
- Please write simple code and concise documentation, when appropriate.

## License 📗

[Apache 2.0](https://github.com/elastic/app-search-node/blob/master/LICENSE.txt) © [Elastic](https://github.com/elastic)

Thank you to all the [contributors](https://github.com/elastic/app-search-node/graphs/contributors)!
