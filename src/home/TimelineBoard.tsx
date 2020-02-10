import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  Card,
  List,
  ListItem,
  CircularProgress,
  CardHeader
} from '@material-ui/core';

import TimelineLogo from '../common/TimelineLogo';

import { TimelineInfo } from '../data/timeline';
import UserTimelineLogo from '../common/UserTimelineLogo';
import { Link } from 'react-router-dom';

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
  title: {
    background: 'beige'
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
    marginRight: `${theme.spacing(0.5)}px`,
    color: '#464545'
  },
  link: {
    color: '#1f82fe',
    textDecoration: 'none'
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
      <CardHeader title={props.title} className={classes.title} />
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
                const isPersonal = t.name == null;
                const name = isPersonal ? '@' + t.owner.username : t.name;
                return (
                  <ListItem key={name}>
                    {isPersonal ? (
                      <UserTimelineLogo className={classes.timelineIcon} />
                    ) : (
                      <TimelineLogo className={classes.timelineIcon} />
                    )}
                    <Link
                      className={classes.link}
                      to={
                        isPersonal
                          ? `/users/${t.owner.username}`
                          : `/timelines/${t.name}`
                      }
                    >
                      {name}
                    </Link>
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
