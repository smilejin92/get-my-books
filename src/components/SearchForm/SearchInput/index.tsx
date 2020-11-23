import React, { ChangeEvent } from 'react';
import classNames from 'classnames/bind';
import s from './style.module.scss';

interface InputProps {
  prevQuery: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const cx = classNames.bind(s);

function SearchInput({ prevQuery, handleChange }: InputProps) {
  return (
    <label
      className={cx('icon-search', 'search-term-label')}
      htmlFor="search-term"
      aria-label="검색어"
    >
      <input
        id="search-term"
        // type="search" // addEventListener 문제
        type="text"
        className={s['search-term']}
        placeholder="제목을 입력해주세요"
        autoComplete="off"
        defaultValue={prevQuery}
        onChange={handleChange}
      />
    </label>
  );
}

export default SearchInput;
