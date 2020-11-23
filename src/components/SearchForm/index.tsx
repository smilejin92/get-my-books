import React, { FormEvent, useCallback } from 'react';
import SearchInputContainer from '../../containers/SearchInputContainer';
import s from './index.module.scss';

function SearchForm() {
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <form className={s['search-form']} onSubmit={handleSubmit}>
      <fieldset>
        <legend className="a11y-hidden">검색 폼</legend>
        <SearchInputContainer />
      </fieldset>
    </form>
  );
}

export default SearchForm;
