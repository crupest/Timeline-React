import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';

import { TimelineInfo } from '../data/timeline';

import TimelineLogo from '../common/TimelineLogo';
import UserTimelineLogo from '../common/UserTimelineLogo';

export interface TimelineBoardProps {
  title?: string;
  timelines?: TimelineInfo[];
  className?: string;
}

const TimelineBoard: React.FC<TimelineBoardProps> = props => {
  const { title, timelines, className } = props;

  return (
    <div className={clsx('timeline-board', className)}>
      {title != null && <h3 className="text-center">{title}</h3>}
      {(() => {
        if (timelines == null) {
          return (
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
              <Spinner color="primary" />
            </div>
          );
        } else {
          return timelines.map(timeline => {
            const { name } = timeline;
            const isPersonal = name.startsWith('@');
            const url = isPersonal
              ? `/users/${timeline.owner.username}`
              : `/timelines/${name}`;
            return (
              <div key={name} className="timeline-item">
                {isPersonal ? (
                  <UserTimelineLogo className="icon" />
                ) : (
                  <TimelineLogo className="icon" />
                )}
                <Link to={url}>{name}</Link>
              </div>
            );
          });
        }
      })()}
    </div>
  );
};

export default TimelineBoard;
