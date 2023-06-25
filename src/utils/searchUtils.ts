import algoliasearch from 'algoliasearch';
import { AutoCompleteResponse, ModuleInformation } from '../types/modules';

const index_name = 'modules';
const app_id = process.env.ALGOLIA_APP_ID || '';
const api_key = process.env.ALGOLIA_API_KEY || '';

const client = algoliasearch(app_id, api_key);
const index = client.initIndex(index_name);

const AUTOCOMPLETE_CACHE_LIMIT = 10;
const autocompleteCache = new Map<string, AutoCompleteResponse>();

export const autocompleteModule = async (query: string) => {
  if (autocompleteCache.has(query)) {
    return autocompleteCache.get(query);
  }

  try {
    const response = await index.search<ModuleInformation>(query, {
      hitsPerPage: 10,
    });
    const data = response.hits.map((module) => module as ModuleInformation);
    const result: AutoCompleteResponse = {
      hitsNo: response.nbHits,
      data: data,
    };
    if (data.length > 0) cacheAutocompleteResults(query, result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const cacheAutocompleteResults = (
  query: string,
  mod: AutoCompleteResponse
) => {
  if (autocompleteCache.size >= AUTOCOMPLETE_CACHE_LIMIT) {
    const queries = Array.from(autocompleteCache.keys());
    autocompleteCache.delete(queries[0]);
  }
  autocompleteCache.set(query, mod);
};
