import React from 'react';
import { from } from 'rxjs';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';

interface TimelineBoardAreaWithoutUserProps {
  fetch: () => Promise<TimelineInfo[]>;
  className?: string;
}

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = props => {
  const [timelines, setTimelines] = React.useState<TimelineInfo[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    const subscription = from(props.fetch()).subscribe(t => {
      setTimelines(t);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <TimelineBoard
      className={props.className}
      title="All Timelines"
      timelines={timelines}
    />
  );
};

export default TimelineBoardAreaWithoutUser;
