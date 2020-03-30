import React from 'react';
import { Container, Spinner, Row, Card } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { TimelineInfo } from '../data/timeline';
import UserTimelineLogo from '../common/UserTimelineLogo';
import TimelineLogo from '../common/TimelineLogo';
import { Link } from 'react-router-dom';

interface TimelineBoardAreaWithoutUserProps {
  publicTimelines?: TimelineInfo[];
}

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = props => {
  const { t } = useTranslation();

  const { publicTimelines } = props;

  if (publicTimelines == null) {
    return (
      <Row className="justify-content-center">
        <Spinner color="primary" />
      </Row>
    );
  }

  return (
    <Row className="p-3 justify-content-center">
      <div className="cru-card container">
        {publicTimelines.map(timeline => {
          const { name } = timeline;
          const isPersonal = name.startsWith('@');
          return (
            <div key={name} className="timeline-item">
              {isPersonal ? (
                <UserTimelineLogo className="icon" />
              ) : (
                <TimelineLogo className="icon" />
              )}
              <Link
                to={
                  isPersonal
                    ? `/users/${timeline.owner.username}`
                    : `/timelines/${t.name}`
                }
              >
                {name}
              </Link>
            </div>
          );
        })}
      </div>
    </Row>
  );
};

export default TimelineBoardAreaWithoutUser;
