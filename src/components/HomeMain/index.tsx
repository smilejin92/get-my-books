import React from 'react';
import ResultSummaryContainer from '../../containers/ResultSummaryContainer';
import { Book } from '../../redux/modules/books';
import ErrorBg from '../ErrorBg';
import HomeMainBg from '../HomeMainBg';
import Loading from '../Loading';
import ResultSummary from '../ResultSummary';
import s from './style.module.scss';

interface HomeMainProps {
  searchQuery?: string;
  loading?: boolean;
  books?: Book[] | null;
  filteredBooks?: Book[] | null;
  error?: Error | null;
}

const HomeMain: React.FC<HomeMainProps> = ({
  searchQuery = 'test',
  loading = false,
  books = [],
  filteredBooks = null,
  error = new Error(),
}) => (
  <main className={s['main']}>
    <section>
      <h2 className="a11y-hidden">검색 결과</h2>
      {!searchQuery && <HomeMainBg />}
      {loading && <Loading />}
      {error && <ErrorBg />}
      {books ? <ResultSummary /> : <HomeMainBg />}
    </section>
  </main>
);

export default HomeMain;
