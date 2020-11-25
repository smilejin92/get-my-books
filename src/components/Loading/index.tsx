import React from 'react';
import s from './style.module.scss';
import duck from '../../assets/duck.gif';

const Loading: React.FC = () => (
  <p className={s['loader-container']}>
    <img src={duck} alt="로딩 중" />
  </p>
);

export default Loading;
