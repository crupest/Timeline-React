import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

import { TimelinePostInfo } from '../data/timeline';

import TimelineItem from './TimelineItem';

const useStyles = makeStyles((_: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export interface TimelineProps {
  className?: string;
  posts: TimelinePostInfo[];
}

const Timeline: React.FC<TimelineProps> = props => {
  const classes = useStyles();

  const [indexShowDeleteButton, setIndexShowDeleteButton] = useState<number>(
    -1
  );

  const posts = props.posts;

  return (
    <div
      className={clsx(classes.container, props.className)}
      onLoad={e => {
        e.currentTarget.scrollTo(0, e.currentTarget.scrollHeight);
      }}
    >
      {(() => {
        const length = posts.length;
        return posts.map((post, i) => {
          return (
            <TimelineItem
              post={post}
              key={post.id}
              current={length - 1 === i}
              showDeleteButton={indexShowDeleteButton === i}
              onClick={() => {
                if (indexShowDeleteButton === i) {
                  setIndexShowDeleteButton(-1);
                } else {
                  setIndexShowDeleteButton(i);
                }
              }}
            />
          );
        });
      })()}
    </div>
  );
};

export default Timeline;
