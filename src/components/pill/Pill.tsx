import { FC, ReactNode } from 'react';

import './Pill.css';

type CardProps = {
  children: ReactNode;
};

export const Pill: FC<CardProps> = ({ children }) => {
  return <div className='pill-container'>{children}</div>;
};
