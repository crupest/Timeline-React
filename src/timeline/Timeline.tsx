import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

import { TimelinePostInfo } from '../data/timeline';

import TimelineItem from './TimelineItem';

const useStyles = makeStyles((_: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export interface TimelineProps {
  posts: TimelinePostInfo[];
}

const Timeline: React.FC<TimelineProps> = props => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {props.posts.map(post => (
        <TimelineItem post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Timeline;
