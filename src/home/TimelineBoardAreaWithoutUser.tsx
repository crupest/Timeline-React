import React from 'react';
import { Row, Col } from 'reactstrap';

import { TimelineInfo } from '../data/timeline';

import TimelineBoard from './TimelineBoard';

interface TimelineBoardAreaWithoutUserProps {
  publicTimelines?: TimelineInfo[];
}

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = props => {
  const { publicTimelines } = props;

  return (
    <Row className="my-2">
      <Col>
        <TimelineBoard timelines={publicTimelines} />
      </Col>
    </Row>
  );
};

export default TimelineBoardAreaWithoutUser;
