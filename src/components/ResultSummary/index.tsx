import React from 'react';
import s from './style.module.scss';
import formatNumber from '../../lib/formatNumber';

interface ResultSummaryProps {
  query?: string;
  totalCount?: number;
  countFiltered?: number | null;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
  query = 'test',
  totalCount = 5,
  countFiltered = 2,
}) => (
  <p className={s['summary']}>
    <span className={s['search-term']}>{`"${query}"`}</span> 검색 결과{' '}
    <span className={s['total']}>{formatNumber(totalCount)}</span>건
    {countFiltered !== null && countFiltered >= 0 && (
      <span>
        {' '}
        중 <span className={s['total']}>{formatNumber(countFiltered)}</span>건
      </span>
    )}
  </p>
);

export default ResultSummary;
