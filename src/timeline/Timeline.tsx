import React, { useState } from 'react';
import clsx from 'clsx';

import { TimelinePostInfo } from '../data/timeline';

import TimelineItem from './TimelineItem';
import { Container } from 'reactstrap';

export interface TimelinePostInfoEx extends TimelinePostInfo {
  deletable: boolean;
}

export type TimelineDeleteCallback = (index: number, id: number) => void;

export interface TimelineProps {
  className?: string;
  avatarKey?: number | string;
  posts: TimelinePostInfoEx[];
  onDelete: TimelineDeleteCallback;
}

const Timeline: React.FC<TimelineProps> = props => {
  const [indexShowDeleteButton, setIndexShowDeleteButton] = useState<number>(
    -1
  );

  const posts = props.posts;

  return (
    <Container fluid className={clsx('d-flex', 'flex-column', props.className)}>
      {(() => {
        const length = posts.length;
        return posts.map((post, i) => {
          return (
            <TimelineItem
              post={post}
              avatarKey={props.avatarKey}
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
    </Container>
  );
};

export default Timeline;
