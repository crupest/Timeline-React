import React from 'react';

import TimelineLogo from '../common/TimelineLogo';

import { TimelineInfo } from '../data/timeline';
import UserTimelineLogo from '../common/UserTimelineLogo';
import { Link } from 'react-router-dom';
import { Spinner, ListGroup, ListGroupItem } from 'reactstrap';

export interface TimelineBoardProps {
  title: string;
  timelines?: TimelineInfo[];
  className?: string;
}

const TimelineBoard: React.FC<TimelineBoardProps> = props => {
  return (
    <div className="">
      <h3 className="text-center">{props.title}</h3>
      {(() => {
        if (props.timelines == null) {
          return (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner />
            </div>
          );
        } else {
          return (
            <ListGroup>
              {props.timelines.map(t => {
                const isPersonal = t.name == null;
                const name = isPersonal ? '@' + t.owner.username : t.name;
                return (
                  <ListGroupItem
                    key={name}
                    className="d-flex align-items-center"
                  >
                    {isPersonal ? (
                      <UserTimelineLogo className="timeline-item-icon" />
                    ) : (
                      <TimelineLogo className="timeline-item-icon" />
                    )}
                    <Link
                      to={
                        isPersonal
                          ? `/users/${t.owner.username}`
                          : `/timelines/${t.name}`
                      }
                    >
                      {name}
                    </Link>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          );
        }
      })()}
    </div>
  );
};

export default TimelineBoard;
