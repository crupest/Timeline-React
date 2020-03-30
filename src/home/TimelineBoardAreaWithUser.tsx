import React from 'react';
import { useTranslation } from 'react-i18next';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';
import { Row, Col } from 'reactstrap';

interface TimelineBoardAreaWithUserProps {
  ownTimelines?: TimelineInfo[];
  joinTimelines?: TimelineInfo[];
}

const TimelineBoardAreaWithUser: React.FC<TimelineBoardAreaWithUserProps> = props => {
  const { t } = useTranslation();

  return (
    <Row className="my-2">
      <Col className="col-12 col-sm-6 py-2">
        <TimelineBoard
          title={t('home.ownTimeline')}
          timelines={props.ownTimelines}
        />
      </Col>
      <Col className="col-12 col-sm-6 py-2">
        <TimelineBoard
          title={t('home.joinTimeline')}
          timelines={props.joinTimelines}
        />
      </Col>
    </Row>
  );
};

export default TimelineBoardAreaWithUser;
