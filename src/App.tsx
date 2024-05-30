import axios, { AxiosError, CancelToken } from 'axios';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Card } from './components';
import { ResultType } from './types';

import './App.css';

const NPM_SEARCH_URL = 'https://api.npms.io/v2/search/suggestions';
const DEBOUNCE_DELAY = 300;

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // We use an uncontrolled input below, so while the user sees whatever they type, instantly the value is being debounced here.
  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchQuery(value);
  }, DEBOUNCE_DELAY);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
    setLoading(true);
    setError('');
  }, []);

  // Even though our "query" param is always going to be using searchQuery, we only need to create and memoize this function once.
  // Using searchQuery directly would require it to be added to the dependency array, which would recreate this each time searchQuery changes.
  const fetchPackages = useCallback(
    async (query: string, token: CancelToken) => {
      const { data } = await axios.get(`${NPM_SEARCH_URL}?q=${query}`, {
        cancelToken: token,
      });

      // For the purposes of this app, I just want the package data (name, description, link, etc)
      return data.map((result: { package: ResultType }) => result.package);
    },
    []
  );

  // This handles the package fetching. searchQuery is debounced above, which fetches after a delay and prevents excess HTTP requests.
  useEffect(() => {
    const source = axios.CancelToken.source();

    if (searchQuery) {
      fetchPackages(searchQuery, source.token)
        .then(setSearchResults)
        .catch((error: AxiosError) => {
          if (axios.isCancel(source)) {
            // If we cancel the fetch, just return, as this is expected to happen due to the
            return;
          }

          // handle error
          setError(error.message);
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }

    setLoading(false);
  }, [fetchPackages, searchQuery]);

  return (
    <div className='container'>
      <div>
        <input onChange={onInputChange} placeholder='Search packages' />
      </div>

      <div className='results'>
        {loading ? (
          <div className='loader'></div>
        ) : (
          searchResults.map((result, index) => (
            <Card key={index} result={result} />
          ))
        )}

        {error && (
          <div className='error'>
            <p>An error has occurred:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};
