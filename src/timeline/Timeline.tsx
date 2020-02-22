import React, { useState } from 'react';
import clsx from 'clsx';
import { Container } from 'reactstrap';

import { TimelinePostInfo } from '../data/timeline';

import TimelineItem from './TimelineItem';

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
    <div className={clsx('pr-2', props.className)}>
      <Container fluid className="d-flex flex-column">
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
    </div>
  );
};

export default Timeline;
