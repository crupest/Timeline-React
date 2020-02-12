import React from 'react';
import { from } from 'rxjs';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';

interface TimelineBoardAreaWithUserProps {
  fetchOwn: () => Promise<TimelineInfo[]>;
  fetchJoin: () => Promise<TimelineInfo[]>;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    }
  },
  boardBox: {
    width: '100%',
    minHeight: '300px',
    padding: `${theme.spacing(1)}px`,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center'
  },
  board: {
    width: '100%',
    maxWidth: '500px'
  }
}));

const TimelineBoardAreaWithUser: React.FC<TimelineBoardAreaWithUserProps> = props => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [ownTimelines, setOwnTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);
  const [joinTimelines, setJoinTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);

  React.useEffect(() => {
    const subscription = from(props.fetchOwn()).subscribe(ts => {
      setOwnTimelines(ts);
    });
    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const subscription = from(props.fetchJoin()).subscribe(ts => {
      setJoinTimelines(ts);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.boardBox}>
        <TimelineBoard
          className={classes.board}
          title={t('home.ownTimeline')}
          timelines={ownTimelines}
        />
      </div>
      <div className={classes.boardBox}>
        <TimelineBoard
          className={classes.board}
          title={t('home.joinTimeline')}
          timelines={joinTimelines}
        />
      </div>
    </div>
  );
};

export default TimelineBoardAreaWithUser;
