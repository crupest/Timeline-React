import React from 'react';
import { from } from 'rxjs';
import { makeStyles, Theme } from '@material-ui/core';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';

interface TimelineBoardAreaWithoutUserProps {
  fetch: () => Promise<TimelineInfo[]>;
}

const useStyles = makeStyles((theme: Theme) => ({
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

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = props => {
  const classes = useStyles();

  const [timelines, setTimelines] = React.useState<TimelineInfo[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    const subscription = from(props.fetch()).subscribe(ts => {
      setTimelines(ts);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className={classes.boardBox}>
      <TimelineBoard
        className={classes.board}
        title="All Timelines"
        timelines={timelines}
      />
    </div>
  );
};

export default TimelineBoardAreaWithoutUser;
