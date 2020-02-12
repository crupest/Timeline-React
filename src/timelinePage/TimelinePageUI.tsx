import React from 'react';
import { CircularProgress, makeStyles, Theme } from '@material-ui/core';

import { OrdinaryTimelineInfo } from '../data/timeline';

import AppBar from '../common/AppBar';
import {
  TimelinePostInfoEx,
  TimelineDeleteCallback
} from '../timeline/Timeline';
import { TimelinePostSendCallback } from '../timeline/TimelinePostEdit';
import TimelineInfoCard, {
  TimelineInfoEditCallbacks as TimelineManageCallbacks
} from './TimelineInfoCard';

export interface TimelinePageUIProps {
  timeline: OrdinaryTimelineInfo | null;
  posts: TimelinePostInfoEx[] | null;
  onDelete?: TimelineDeleteCallback;
  onPost?: TimelinePostSendCallback;
  manageCallbacks?: TimelineManageCallbacks;
}

const useStyles = makeStyles((theme: Theme) => ({
  loadingContainer: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '56px',
    boxSizing: 'border-box'
  }
}));

const TimelinePageUI: React.FC<TimelinePageUIProps> = props => {
  const classes = useStyles();

  return (
    <>
      <AppBar />
      {(() => {
        if (props.timeline == null) {
          return (
            <div className={classes.loadingContainer}>
              <CircularProgress />
            </div>
          );
        } else {
          return <TimelineInfoCard timeline={props.timeline} />;
        }
      })()}
    </>
  );
};

export default TimelinePageUI;
