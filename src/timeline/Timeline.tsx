import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

import { TimelinePostInfo } from '../data/timeline';

import TimelineItem from './TimelineItem';

export interface TimelinePostInfoEx extends TimelinePostInfo {
  deletable: boolean;
}

const useStyles = makeStyles((_: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export interface TimelineProps {
  className?: string;
  posts: TimelinePostInfoEx[];
  onDelete: (index: number, id: number) => void;
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
                if (indexShowDeleteButton !== i && post.deletable) {
                  setIndexShowDeleteButton(i);
                } else {
                  setIndexShowDeleteButton(-1);
                }
              }}
              onDelete={() => {
                props.onDelete(i, post.id);
              }}
            />
          );
        });
      })()}
    </div>
  );
};

export default Timeline;
