import React from 'react';
import s from './style.module.scss';
import errorImage from '../../assets/error-image.jpg';

const ErrorBg: React.FC = () => (
  <p className={s['error-container']}>
    <img src={errorImage} alt="에러가 발생했습니다. 다시 시도해주세요." />
  </p>
);

export default ErrorBg;
