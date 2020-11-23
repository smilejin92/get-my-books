import { debounce } from 'lodash';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import SearchInput from '../components/SearchForm/SearchInput';
import { resetState, setQuery } from '../redux/modules/books';
import { RootState } from '../redux/modules/reducer';

const INTERVAL = 500;

function SearchInputContainer() {
  const prevQuery = useSelector(({ books }: RootState) => books.query);
  const dispatch = useDispatch();
  const history = useHistory();

  const debouncedSearch = useMemo(
    () =>
      debounce(({ target }: ChangeEvent<HTMLInputElement>) => {
        const query = target.value.trim();

        if (query === prevQuery) return;

        if (!query) {
          history.push('/');
          dispatch(resetState());
          return;
        }

        dispatch(setQuery(query));
        history.push(`/results/query=${query}`);
      }, INTERVAL),
    [prevQuery, dispatch, history],
  );

  // add/removeEventListener에 전달되는 콜백의 타입을 어떻게 맞춰줘야하는지...
  // useEffect(() => {
  //   const searchBox = document.getElementById('search-term');
  //   searchBox?.addEventListener('search', debouncedSearch);

  //   return () => {
  //     searchBox?.removeEventListener('search', debouncedSearch);
  //   };
  // }, [debouncedSearch]);

  return <SearchInput prevQuery={prevQuery} handleChange={debouncedSearch} />;
}

export default SearchInputContainer;
