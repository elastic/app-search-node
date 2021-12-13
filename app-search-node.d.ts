declare module "@elastic/app-search-node" {
  export = AppSearchClient;

  namespace AppSearchClient {
    export interface DocumentResponse {
      id: string;
      errors: string[];
    }

    export interface SingleDocumentResponse {
      id: string;
    }
    export interface Paging {
      total_pages: number;
      size: number;
      current: number;
      total_results: number;
    }
    export interface SearchResponse {
      meta: {
        warnings: string[];
        page: Paging;
        alerts: string[];
        precision?: number;
        request_id?: string;
        engine?: {
          name: string;
          type: string;
        };
      };
      results: Record<string, any>[];
    }

    export interface PagedResponse {
      meta: {
        page: Paging;
      };
      results: Record<string, any>[];
    }

    export interface QuerySuggestionsResponse {
      meta: {
        request_id: string;
      };
      results: {
        documents: QuerySuggestion[];
      };
    }

    export interface QuerySuggestion {
      suggestion: string;
    }

    export interface DeleteResponse {
      deleted: boolean;
    }

    export interface DocumentDeleteResponse {
      deleted: boolean;
      result: boolean;
      id: string;
    }
  }

  class AppSearchClient {
    /**
     * @example
     *
     * // Typical usage:
     * const apiKey = 'private-mu75psc5egt9ppzuycnc2mc3'
     * const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
     * const client = new AppSearchClient(undefined, apiKey, baseUrlFn)
     *
     * // Deprecated usage for Swiftype.com:
     * const hostIdentifier = "host-c5s2mj";
     * const apiKey = "private-mu75psc5egt9ppzuycnc2mc3";
     * const client = new AppSearchClient(hostIdentifier, apiKey)
     */
    constructor(
      accountHostKey: string | undefined,
      apiKey: string,
      baseUrlFn?: (accountHostKey: any) => string
    );

    /**
     * Submit a search and receive a set of results with meta data
     *
     * `options` are documented [here](https://www.elastic.co/guide/en/app-search/current/search.html)
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const query = "cat";
     * const options = {
     *   search_fields: { title: {} },
     *   result_fields: { title: { raw: {} } },
     * };
     *
     * try {
     *   const response = await client.search(engineName, query);
     *   console.log(response.results);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    search(
      engineName: string,
      query: string,
      options?: Record<string, any>
    ): Promise<AppSearchClient.SearchResponse>;

    /**
     * Run multiple searches for documents on a single request
     *
     * `options` are documented [here](https://www.elastic.co/guide/en/app-search/current/multi-search.html)
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const searches = [
     *   {
     *     query: "cat",
     *     options: {
     *       search_fields: { title: {} },
     *       result_fields: { title: { raw: {} } },
     *     },
     *   },
     *   { query: "grumpy" },
     * ];
     *
     * try {
     *   const responses = await client.multiSearch(engineName, query);
     *   console.log(responses);
     * } catch (e) {
     *   console.error(e)
     * }
     */
    multiSearch(
      engineName: string,
      searches: { query: string; options?: Record<string, any> }[]
    ): Promise<AppSearchClient.SearchResponse[]>;

    /**
     * Provide relevant query suggestions for incomplete queries
     *
     * `options` are documented [here](https://www.elastic.co/guide/en/app-search/current/query-suggestion.html)
     *
     *
     */
    querySuggestion(
      engineName: string,
      query: string,
      options?: Record<string, any>
    ): Promise<AppSearchClient.QuerySuggestionsResponse>;

    /**
     * Create or update a single document
     *
     * https://www.elastic.co/guide/en/app-search/current/documents.html#documents-create
     * 
     * @example
     * 
     * const engineName = "favorite-videos";
     * const document = {
     *   id: "INscMGmhmX4",
     *   url: "https://www.youtube.com/watch?v=INscMGmhmX4",
     *   title: "The Original Grumpy Cat",
     *   body: "A wonderful video of a magnificent cat.",
     * };
     * 
     * try {
     *   const singleDocumentResponse = await client.indexDocument(engineName, document);
     *   console.log(`Indexed ${singleDocumentResponse.id} succesfully`);
     * } catch (e) {
     *   console.log(e);
     * }

     */
    indexDocument(
      engineName: string,
      document: Record<string, any>
    ): Promise<AppSearchClient.SingleDocumentResponse>;

    /**
     * Create or update documents
     *
     * https://www.elastic.co/guide/en/app-search/current/documents.html#documents-create
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const documents = [
     *   {
     *     id: "INscMGmhmX4",
     *     url: "https://www.youtube.com/watch?v=INscMGmhmX4",
     *     title: "The Original Grumpy Cat",
     *     body: "A wonderful video of a magnificent cat.",
     *   },
     *   {
     *     id: "JNDFojsd02",
     *     url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
     *     title: "Another Grumpy Cat",
     *     body: "A great video of another cool cat.",
     *   },
     * ];
     *
     * try {
     *   const documentResponses = await client.indexDocuments(engineName, document);
     *   const succesfullyIndexedDocumentIds = documentResponses
     *     .filter((documentResponse) => documentResponse.errors.length === 0)
     *     .map((documentResponse) => documentResponse.id)
     *     .join(", ");
     *   console.log(
     *     `Documents indexed successfully: ${succesfullyIndexedDocumentIds}`
     *   );
     *
     *   const failures = documentResponses.filter(
     *     (documentResponse) => documentResponse.errors.length > 0
     *   );
     *   if (failures.length > 0) {
     *     console.log(
     *       `Other documents failed with errors: ${failures
     *         .map((documentResponse) => documentResponse.errors)
     *         .join(", ")}`
     *     );
     *   }
     * } catch (e) {
     *   console.log(e);
     * }
     */
    indexDocuments(
      engineName: string,
      documents: Record<string, any>[]
    ): Promise<AppSearchClient.DocumentResponse[]>;

    /**
     * Update specific document fields by id and field
     *
     * https://www.elastic.co/guide/en/app-search/current/documents.html#documents-create
     *
     * @example
     * const engineName = "favorite-videos";
     * const documents = [
     *   {
     *     id: "INscMGmhmX4",
     *     title: "Updated title",
     *   },
     *   {
     *     id: "JNDFojsd02",
     *     title: "Updated title",
     *   },
     * ];
     *
     * try {
     *   const documentResponses = await client.updateDocuments(engineName, document);
     *   const succesfullyIndexedDocumentIds = documentResponses
     *     .filter((documentResponse) => documentResponse.errors.length === 0)
     *     .map((documentResponse) => documentResponse.id)
     *     .join(", ");
     *   console.log(
     *     `Documents updated successfully: ${succesfullyIndexedDocumentIds}`
     *   );
     *
     *   const failures = documentResponses.filter(
     *     (documentResponse) => documentResponse.errors.length > 0
     *   );
     *   if (failures.length > 0) {
     *     console.log(
     *       `Other documents failed with errors: ${failures
     *         .map((documentResponse) => documentResponse.errors)
     *         .join(", ")}`
     *     );
     *   }
     * } catch (e) {
     *   console.log(e);
     * }
     */
    updateDocuments(
      engineName: string,
      documents: Record<string, any>[]
    ): Promise<AppSearchClient.DocumentResponse[]>;

    /**
     * Lists up to 10,000 documents
     *
     * https://www.elastic.co/guide/en/app-search/current/documents.html#documents-list
     *
     * @example
     *
     * const engineName = "favorite-videos";
     *
     * try {
     *   const documentList = await client.listDocuments(engineName, {
     *     page: { size: 10, current: 1 },
     *   });
     *   documentList.results.forEach((r) => console.log(r));
     * } catch (e) {
     *   console.error(e);
     * }
     */
    listDocuments(
      engineName: string,
      options?: Record<string, any>
    ): Promise<AppSearchClient.PagedResponse>;

    /**
     * Retrieves one or more documents by id
     *
     * https://www.elastic.co/guide/en/app-search/current/documents.html#documents-get
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const documentIds = ["INscMGmhmX4", "JNDFojsd02"];
     *
     * try {
     *   const documents = await client.getDocuments(engineName, documentIds);
     *   // documents that are not found return as null
     *   console.log(documents.filter((document) => document !== null));
     * } catch (e) {
     *   console.error(e);
     * }
     */
    getDocuments(
      engineName: string,
      ids: string[]
    ): Promise<Array<Record<string, any> | null>>;

    /**
     * Deletes documents for given Document IDs
     *
     * https://www.elastic.co/guide/en/app-search/current/documents.html#documents-delete
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const documentIds = ["INscMGmhmX4", "JNDFojsd02"];
     *
     * try {
     *   const response = await client.destroyDocuments(engineName, documentIds);
     *   const deltedIds = response.filter((r) => r.deleted === true).map((r) => r.id);
     *   console.log(`Deleted documents ${deltedIds.join(", ")}`);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    destroyDocuments(
      engineName: string,
      ids: string[]
    ): Promise<AppSearchClient.DocumentDeleteResponse[]>;

    /**
     * Retrieves all engines with optional pagination support
     *
     * https://www.elastic.co/guide/en/app-search/current/engines.html#engines-list
     *
     * @example
     *
     * try {
     *   const engines = await client.listEngines({ page: { size: 10, current: 1 } });
     *   engines.results.forEach(r => console.log(r));
     * } catch (e) {
     *   console.error(e);
     * }
     */
    listEngines(
      options?: Record<string, any>
    ): Promise<AppSearchClient.PagedResponse>;

    /**
     * Retrieves details of a given engine by its name
     *
     * https://www.elastic.co/guide/en/app-search/current/engines.html#engines-get
     *
     * @example
     *
     * const engineName = "favorite-videos";
     *
     * try {
     *   const engine = await client.getEngine(engineName);
     *   console.log(engine);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    getEngine(engineName: string): Promise<Record<string, any>>;

    /**
     * Creates an App Search Engine
     *
     * https://www.elastic.co/guide/en/app-search/current/engines.html#engines-create
     *
     * @example
     *
     * const engineName = "favorite-videos";
     *
     * try {
     *   const engine = await client.createEngine(engineName, { language: "en" });
     *   console.log(engine);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    createEngine(
      engineName: string,
      options?: Record<string, any>
    ): Promise<Record<string, any>>;

    /**
     * Deletes a source engine from a given meta engine
     *
     * https://www.elastic.co/guide/en/app-search/current/meta-engines.html#meta-engines-remove-source-engines
     *
     * @example
     *
     * const engineName = "favorite-videos";
     *
     * try {
     *   const response = await client.destroyEngine(engineName);
     *   console.log(response);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    destroyEngine(engineName: string): Promise<AppSearchClient.DeleteResponse>;

    /**
     * Retrieve available curations for the given engine
     *
     * https://www.elastic.co/guide/en/app-search/current/curations.html#curations-read
     *
     * @example
     *
     * const engineName = "favorite-videos";
     *
     * try {
     *   const curationsList = await client.listCurations(engineName, {
     *     page: { size: 10, current: 1 },
     *   });
     *   curationsList.results.forEach(r => console.log(r));
     * } catch (e) {
     *   console.error(e);
     * }
     */
    listCurations(
      engineName: string,
      options?: Record<string, any>
    ): Promise<AppSearchClient.PagedResponse>;

    /**
     * Retrieves a curation by ID
     *
     * https://www.elastic.co/guide/en/app-search/current/curations.html#curations-read
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const curationId = "cur-7438290";
     *
     * try {
     *   const curation = await client.getCuration(engineName, curationId);
     *   console.log(curation);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    getCuration(
      engineName: string,
      curationId: string
    ): Promise<Record<string, any>>;

    /**
     * Create a new curation for the engine
     *
     * https://www.elastic.co/guide/en/app-search/current/curations.html#curations-create
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const newCuration = {
     *   queries: ["cat blop"],
     *   promoted: ["Jdas78932"],
     * };
     *
     * try {
     *   const curation = await client.createCuration(engineName, newCuration);
     *   console.log(curation);
     * } catch (e) {
     *   console.error(e);
     * }
     *
     */
    createCuration(
      engineName: string,
      newCuration: Record<string, any>
    ): Promise<Record<string, any>>;

    /**
     * Updates an existing curation 
     * 
     * https://www.elastic.co/guide/en/app-search/current/curations.html#curations-update
     * 
     * const engineName = "favorite-videos";
     * const curationId = "cur-7438290";
     * const newDetails = {
     *   queries: ["cat blop"],
     *   promoted: ["Jdas78932", "JFayf782"],
     * };

     * try {
     *   const curation = await client.updateCuration(
     *     engineName,
     *     curationId,
     *     newDetails
     *   );
     *   console.log(curation);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    updateCuration(
      engineName: string,
      curationId: string,
      newCuration: Record<string, any>
    ): Promise<Record<string, any>>;

    /**
     * Deletes a curation set by ID
     *
     * https://www.elastic.co/guide/en/app-search/current/curations.html#curations-destroy
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const curationId = "cur-7438290";
     *
     * try {
     *   const response = await client.destroyCuration(engineName, curationId);
     *   console.log(response.deleted);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    destroyCuration(
      engineName: string,
      curationId: string
    ): Promise<AppSearchClient.DeleteResponse>;

    /**
     * Creates a new meta engine
     *
     * https://www.elastic.co/guide/en/app-search/current/engines.html
     * https://www.elastic.co/guide/en/app-search/current/meta-engines-guide.html
     *
     * @example
     *
     * const engineName = "my-meta-engine";
     *
     * try {
     *   const engine = await client.createMetaEngine(engineName, [
     *     "source-engine-1",
     *     "source-engine-2",
     *   ]);
     *   console.log(engine);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    createMetaEngine(
      engineName: string,
      sourceEngines: string[]
    ): Promise<Record<string, any>>;

    /**
     * Adds a source engine to a given meta engine
     *
     * https://www.elastic.co/guide/en/app-search/current/meta-engines.html#meta-engines-add-source-engines
     *
     * @example
     *
     * const engineName = "my-meta-engine";
     *
     * try {
     *   const engine = await client.addMetaEngineSources(engineName, [
     *     "source-engine-3",
     *   ]);
     *   console.log(engine);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    addMetaEngineSources(
      engineName: string,
      sourceEngines: string[]
    ): Promise<Record<string, any>>;

    /**
     * Deletes a source engine from a given meta engine
     *
     * https://www.elastic.co/guide/en/app-search/current/meta-engines.html#meta-engines-remove-source-engines
     *
     * @example
     *
     * const engineName = "my-meta-engine";
     *
     * try {
     *   const engine = await client.deleteMetaEngineSources(engineName, [
     *     "source-engine-3",
     *   ]);
     *   console.log(engine);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    deleteMetaEngineSources(
      engineName: string,
      sourceEngines: string[]
    ): Promise<Record<string, any>>;

    /**
     * Retrieve current schema for the engine
     *
     * https://www.elastic.co/guide/en/app-search/current/schema.html#schema-read
     *
     * @example
     *
     * const engineName = "favorite-videos";
     *
     * try {
     * const schema = await client.getSchema(engineName);
     *   console.log(schema);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    getSchema(engineName: string): Promise<Record<string, any>>;

    /**
     * Update schema for the current engine
     *
     * https://www.elastic.co/guide/en/app-search/current/schema.html#schema-patch
     *
     * @example
     *
     * const engineName = "favorite-videos";
     * const schema = {
     *   views: "number",
     *   created_at: "date",
     * };
     *
     * try {
     *   const updatedSchema = await client.updateSchema(engineName, schema);
     *   console.log(updatedSchema);
     * } catch (e) {
     *   console.error(e);
     * }
     */
    updateSchema(
      engineName: string,
      schema: Record<string, any>
    ): Promise<Record<string, any>>;

    /**
     * Creates a jwt search key that can be used for authentication to enforce a set of required search options.
     * 
     * More details can be found [here](https://www.elastic.co/guide/en/app-search/current/authentication.html#authentication-signed).
     *
     * @param apiKey A public search key for your App Search Engine
     * @param apiKeyName This name must match the name of the key above from your App Search dashboard
     * @param options see the [App Search API](https://www.elastic.co/guide/en/app-search/current/authentication.html#authentication-signed) for supported search options
     * @param signOptions see [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) for supported sign options
     * 
     * @example
     * 
     * const publicSearchKey = 'search-xxxxxxxxxxxxxxxxxxxxxxxx'
     * // This name must match the name of the key above from your App Search dashboard
     * const publicSearchKeyName = 'search-key'
     * const enforcedOptions = {
     *   result_fields: { title: { raw: {} } },
     *   filters: { world_heritage_site: 'true' }
     * }

     * const signOptions = {
     *   expiresIn: '5 minutes'
     * }

     * const signedSearchKey = AppSearchClient.createSignedSearchKey(
     *   publicSearchKey,
     *   publicSearchKeyName,
     *   enforcedOptions,
     *   signOptions
     * )

     * const baseUrlFn = () => 'http://localhost:3002/api/as/v1/'
     * const client = new AppSearchClient(undefined, signedSearchKey, baseUrlFn)

     * client.search('sample-engine', 'everglade')
     */
    static createSignedSearchKey(
      apiKey: string,
      apiKeyName: string,
      options?: Record<string, any>,
      signOptions?: Record<string, any>
    ): void;
  }
}
