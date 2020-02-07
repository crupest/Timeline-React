import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  Card,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  CardHeader
} from '@material-ui/core';

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
