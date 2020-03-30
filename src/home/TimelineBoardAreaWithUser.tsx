import React from 'react';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';

interface TimelineBoardAreaWithUserProps {
  ownTimelines?: TimelineInfo[];
  joinTimelines?: TimelineInfo[];
}

const TimelineBoardAreaWithUser: React.FC<TimelineBoardAreaWithUserProps> = (
  props
) => {
  const { t } = useTranslation();

  return (
    <Row className="my-2 justify-content-center">
      <Col sm="6" lg="5" className="py-2">
        <TimelineBoard
          title={t('home.ownTimeline')}
          timelines={props.ownTimelines}
        />
      </Col>
      <Col sm="6" lg="5" className="py-2">
        <TimelineBoard
          title={t('home.joinTimeline')}
          timelines={props.joinTimelines}
        />
      </Col>
    </Row>
  );
};

export default TimelineBoardAreaWithUser;
