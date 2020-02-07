import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  CardHeader
} from '@material-ui/core';
import timelineImg from './timeline.svg';

import { TimelineInfo } from '../data/timeline';

export interface TimelineBoardProps {
  title: string;
  timelines?: TimelineInfo[];
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  progressBox: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timelineIcon: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    marginRight: `${theme.spacing(0.5)}px`
  }
}));

const TimelineBoard: React.FC<TimelineBoardProps> = props => {
  const classes = useStyles();

  return (
    <Card
      classes={{
        root: clsx(props.className, classes.root)
      }}
    >
      <CardHeader title={props.title} />
      {(() => {
        if (props.timelines == null) {
          return (
            <div className={classes.progressBox}>
              <CircularProgress />
            </div>
          );
        } else {
          return (
            <List>
              {props.timelines.map(t => {
                return (
                  <ListItem key={t.name}>
                    <img src={timelineImg} className={classes.timelineIcon} />
                    <ListItemText primary={t.name} />
                  </ListItem>
                );
              })}
            </List>
          );
        }
      })()}
    </Card>
  );
};

export default TimelineBoard;
