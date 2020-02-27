import React from 'react';
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
  posts: TimelinePostInfoEx[];
  onDelete: TimelineDeleteCallback;
}

const Timeline: React.FC<TimelineProps> = props => {
  const { posts } = props;

  const [indexShowDeleteButton, setIndexShowDeleteButton] = React.useState<
    number
  >(-1);

  const onItemClick = React.useMemo(() => {
    return posts.map((post, i) => {
      return () => {
        setIndexShowDeleteButton(oldIndexShowDeleteButton => {
          return oldIndexShowDeleteButton !== i && post.deletable ? i : -1;
        });
      };
    });
  }, [posts]);

  const onItemDelete = React.useMemo(() => {
    return posts.map((post, i) => {
      return () => {
        props.onDelete(i, post.id);
      };
    });
  }, [posts]);

  return (
    <div className={clsx('pr-2', props.className)}>
      <Container fluid className="d-flex flex-column">
        {(() => {
          const length = posts.length;
          return posts.map((post, i) => {
            return (
              <TimelineItem
                post={post}
                key={post.id}
                current={length - 1 === i}
                showDeleteButton={indexShowDeleteButton === i}
                onClick={onItemClick[i]}
                onDelete={onItemDelete[i]}
              />
            );
          });
        })()}
      </Container>
    </div>
  );
};

export default Timeline;
