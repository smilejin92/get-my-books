import React from 'react';
import s from './style.module.scss';
import noInput from '../../assets/no-input.png';

const HomeMainBg: React.FC = () => (
  <p className={s['bg-container']}>
    <img src={noInput} alt="빈 화면" />
  </p>
);

export default HomeMainBg;
