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
const apiKey = "private-mu75psc5egt9ppzuycnc2mc3";
const baseUrlFn = () => "http://localhost:3002/api/as/v1/";
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);
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
const hostIdentifier = "host-c5s2mj";
const apiKey = "private-mu75psc5egt9ppzuycnc2mc3";
const client = new AppSearchClient(hostIdentifier, apiKey);
```

### API Methods

##### Indexing: Creating or Replacing Documents

```javascript
const engineName = "favorite-videos";
const documents = [
  {
    id: "INscMGmhmX4",
    url: "https://www.youtube.com/watch?v=INscMGmhmX4",
    title: "The Original Grumpy Cat",
    body: "A wonderful video of a magnificent cat.",
  },
  {
    id: "JNDFojsd02",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Another Grumpy Cat",
    body: "A great video of another cool cat.",
  },
];

try {
  const documentResponses = await client.indexDocuments(engineName, document);
  const succesfullyIndexedDocumentIds = documentResponses
    .filter((documentResponse) => documentResponse.errors.length === 0)
    .map((documentResponse) => documentResponse.id)
    .join(", ");
  console.log(
    `Documents indexed successfully: ${succesfullyIndexedDocumentIds}`
  );

  const failures = documentResponses.filter(
    (documentResponse) => documentResponse.errors.length > 0
  );
  if (failures.length > 0) {
    console.log(
      `Other documents failed with errors: ${failures
        .map((documentResponse) => documentResponse.errors)
        .join(", ")}`
    );
  }
} catch (e) {
  console.error(e);
}
```

Note that this API will not throw on an indexing error. Errors are inlined in the response body per document:

```json
[
  { "id": "park_rocky-mountain", "errors": [] },
  {
    "id": "park_saguaro",
    "errors": ["Invalid field value: Value 'foo' cannot be parsed as a float"]
  }
]

```

##### Indexing: Updating Documents (Partial Updates)

```javascript
const engineName = "favorite-videos";
const documents = [
  {
    id: "INscMGmhmX4",
    title: "Updated title",
  },
  {
    id: "JNDFojsd02",
    title: "Updated title",
  },
];

try {
  const documentResponses = await client.updateDocuments(engineName, document);
  const succesfullyIndexedDocumentIds = documentResponses
    .filter((documentResponse) => documentResponse.errors.length === 0)
    .map((documentResponse) => documentResponse.id)
    .join(", ");
  console.log(
    `Documents updated successfully: ${succesfullyIndexedDocumentIds}`
  );

  const failures = documentResponses.filter(
    (documentResponse) => documentResponse.errors.length > 0
  );
  if (failures.length > 0) {
    console.log(
      `Other documents failed with errors: ${failures
        .map((documentResponse) => documentResponse.errors)
        .join(", ")}`
    );
  }
} catch (e) {
  console.error(e);
}
```


##### Retrieving Documents

```javascript
const engineName = "favorite-videos";
const documentIds = ["INscMGmhmX4", "JNDFojsd02"];

try {
  const documents = await client.getDocuments(engineName, documentIds);
  // documents that are not found return as null
  console.log(documents.filter((document) => document !== null));
} catch (e) {
  console.error(e);
}
```

##### Listing Documents

```javascript
const engineName = "favorite-videos";
const documentIds = ["INscMGmhmX4", "JNDFojsd02"];

try {
  const documents = await client.getDocuments(engineName, documentIds);
  // documents that are not found return as null
  console.log(documents.filter((document) => document !== null));
} catch (e) {
  console.error(e);
}
```

##### Destroying Documents

```javascript
const engineName = "favorite-videos";
const documentIds = ["INscMGmhmX4", "JNDFojsd02"];

try {
  const response = await client.destroyDocuments(engineName, documentIds);
  const deltedIds = response.filter((r) => r.deleted === true).map((r) => r.id);
  console.log(`Deleted documents ${deltedIds.join(", ")}`);
} catch (e) {
  console.error(e);
}
```

##### Listing Engines

```javascript
try {
  const engines = await client.listEngines({ page: { size: 10, current: 1 } });
  engines.results.forEach((r) => console.log(r));
} catch (e) {
  console.error(e);
}
```

##### Retrieving Engines

```javascript
const engineName = "favorite-videos";

try {
  const engine = await client.getEngine(engineName);
  console.log(engine);
} catch (e) {
  console.error(e);
}
```

##### Creating Engines

```javascript
const engineName = "favorite-videos";

try {
  const engine = await client.createEngine(engineName, { language: "en" });
  console.log(engine);
} catch (e) {
  console.error(e);
}
```

##### Destroying Engines

```javascript
const engineName = "favorite-videos";

try {
  const response = await client.destroyEngine(engineName);
  console.log(response);
} catch (e) {
  console.error(e);
}
```

##### Searching

```javascript
const engineName = "favorite-videos";
const query = "cat";
const options = {
  search_fields: { title: {} },
  result_fields: { title: { raw: {} } },
};

try {
  const response = await client.search(engineName, query);
  console.log(response.results);
} catch (e) {
  console.error(e);
}
```

##### Multi-Search

```javascript
const engineName = "favorite-videos";
const searches = [
  {
    query: "cat",
    options: {
      search_fields: { title: {} },
      result_fields: { title: { raw: {} } },
    },
  },
  { query: "grumpy" },
];

try {
  const responses = await client.multiSearch(engineName, query);
  console.log(responses);
} catch (e) {
  console.error(e);
}
```

##### Query Suggestion

```javascript
const engineName = "favorite-videos";
const document = {
  id: "INscMGmhmX4",
  url: "https://www.youtube.com/watch?v=INscMGmhmX4",
  title: "The Original Grumpy Cat",
  body: "A wonderful video of a magnificent cat.",
};

try {
  const singleDocumentResponse = await client.indexDocument(
    engineName,
    document
  );
  console.log(`Indexed ${singleDocumentResponse.id} succesfully`);
} catch (e) {
  console.error(e);
}
```

##### Listing Curations

```javascript
const engineName = "favorite-videos";

try {
  const curationsList = await client.listCurations(engineName, {
    page: { size: 10, current: 1 },
  });
  curationsList.results.forEach((r) => console.log(r));
} catch (e) {
  console.error(e);
}
```

##### Retrieving Curations

```javascript
const engineName = "favorite-videos";
const curationId = "cur-7438290";

try {
  const curation = await client.getCuration(engineName, curationId);
  console.log(curation);
} catch (e) {
  console.error(e);
}
```

##### Creating Curations

```javascript
const engineName = "favorite-videos";
const newCuration = {
  queries: ["cat blop"],
  promoted: ["Jdas78932"],
};

try {
  const curation = await client.createCuration(engineName, newCuration);
  console.log(curation);
} catch (e) {
  console.error(e);
}
```

##### Updating Curations

```javascript
const engineName = "favorite-videos";
const curationId = "cur-7438290";
const newDetails = {
  queries: ["cat blop"],
  promoted: ["Jdas78932", "JFayf782"],
};

try {
  const curation = await client.updateCuration(
    engineName,
    curationId,
    newDetails
  );
  console.log(curation);
} catch (e) {
  console.error(e);
}
```

##### Deleting Curations

```javascript
const engineName = "favorite-videos";
const curationId = "cur-7438290";

try {
  const response = await client.destroyCuration(engineName, curationId);
  console.log(response.deleted);
} catch (e) {
  console.error(e);
}
```

##### Retrieving Schemas

```javascript
const engineName = "favorite-videos";

try {
  const schema = await client.getSchema(engineName);
  console.log(schema);
} catch (e) {
  console.error(e);
}
```

##### Updating Schemas

```javascript
const engineName = "favorite-videos";
const schema = {
  views: "number",
  created_at: "date",
};

try {
  const updatedSchema = await client.updateSchema(engineName, schema);
  console.log(updatedSchema);
} catch (e) {
  console.error(e);
}
```

##### Create a Signed Search Key

Creating a search key that will only return the title field.

```javascript
const publicSearchKey = "search-xxxxxxxxxxxxxxxxxxxxxxxx";
// This name must match the name of the key above from your App Search dashboard
const publicSearchKeyName = "search-key";
const enforcedOptions = {
  result_fields: { title: { raw: {} } },
  filters: { world_heritage_site: "true" },
};

// Optional. See https://github.com/auth0/node-jsonwebtoken#usage for all options
const signOptions = {
  expiresIn: "5 minutes",
};

const signedSearchKey = AppSearchClient.createSignedSearchKey(
  publicSearchKey,
  publicSearchKeyName,
  enforcedOptions,
  signOptions
);

const baseUrlFn = () => "http://localhost:3002/api/as/v1/";
const client = new AppSearchClient(undefined, signedSearchKey, baseUrlFn);

client.search("sample-engine", "everglade");
```

##### Create a Meta Engine

```javascript
const engineName = "my-meta-engine";

try {
  const engine = await client.createMetaEngine(engineName, [
    "source-engine-1",
    "source-engine-2",
  ]);
  console.log(engine);
} catch (e) {
  console.error(e);
}
```

##### Add a Source Engine to a Meta Engine

```javascript
const engineName = "my-meta-engine";

try {
  const engine = await client.addMetaEngineSources(engineName, [
    "source-engine-3",
  ]);
  console.log(engine);
} catch (e) {
  console.error(e);
}
```

##### Remove a Source Engine from a Meta Engine

```javascript
const engineName = "my-meta-engine";

try {
  const engine = await client.deleteMetaEngineSources(engineName, [
    "source-engine-3",
  ]);
  console.log(engine);
} catch (e) {
  console.error(e);
}
```

##### Creating Engines

```javascript
const engineName = "favorite-videos";

try {
  const engine = await client.createEngine(engineName, { language: "en" });
  console.log(engine);
} catch (e) {
  console.error(e);
}
```

### For App Search APIs not available in this client

We try to keep this client up to date with all of the available API endpoints available from App Search.

There are a few APIs that may not be available yet. For those APIs, please use the low-level client to connect to hit any App Search endpoint.

```javascript
const engineName = 'favorite-videos'
const options = {
  query: 'cats'
}

const Client = require('@elastic/app-search-node/lib/client')
const client = new Client('private-mu75psc5egt9ppzuycnc2mc3', 'http://localhost:3002/api/as/v1/')
client.post(`engines/${encodeURIComponent(engineName)}/search`, options).then(console.log)
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
