

declare module "@elastic/app-search-node" {
  export = AppSearchClient;

  namespace AppSearchClient {
    export interface SearchResponse {
      meta: {
        warnings: string[];
        page: {
          total_pages: number;
          size: number;
          current: number;
          total_results: number;
        };
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
     *   const response = await client.search('national-parks', '')
     *   console.log(response.results)
     * } catch (e) {
     *   console.error(e)
     * }
     */
    search(
      engineName: string,
      query: string,
      options?: Record<string, any>
    ): AppSearchClient.SearchResponse;
  }
}
