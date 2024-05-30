import { formatDistance } from 'date-fns';
import { FC } from 'react';

import { Pill } from '../pill';
import { ResultType } from '../../types';

import './Card.css';

const NPM_BASE_URL = 'https://www.npmjs.com';

type CardProps = {
  result: ResultType;
};

export const Card: FC<CardProps> = ({ result }) => {
  const { name, description, keywords, links, version, date, publisher } =
    result;
  const { npm } = links;
  const { username } = publisher;

  const formattedDate = formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });

  return (
    <div className='card-container'>
      <a
        className='card-link'
        href={npm}
        target='_blank'
        rel='noopener noreferrer'
      >
        {name}
      </a>

      <p>{description}</p>

      <div className='keywords'>
        {keywords &&
          keywords.map((keyword) => <Pill key={keyword}>{keyword}</Pill>)}
      </div>

      <div className='publish-data'>
        <a
          className='publisher-link'
          href={`${NPM_BASE_URL}/~${username}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {username}
        </a>

        <p>published {version}</p>
        <p>•</p>
        <p>{formattedDate}</p>
      </div>
    </div>
  );
};
