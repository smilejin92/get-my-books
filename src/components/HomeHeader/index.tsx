import React from 'react';
import Logo from '../Logo';
import SearchForm from '../SearchForm';
import s from './index.module.scss';

const HomeHeader: React.FC = () => (
  <header className={s['header']}>
    <Logo />
    <section className={s['search-section']}>
      <h2 className="a11y-hidden">검색</h2>
      <SearchForm />
    </section>
  </header>
);

export default HomeHeader;
