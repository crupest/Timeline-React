import React from 'react';
import { Row, Col } from 'reactstrap';

import { TimelineInfo } from '../data/timeline';

import TimelineBoard from './TimelineBoard';

interface TimelineBoardAreaWithoutUserProps {
  publicTimelines?: TimelineInfo[];
}

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = (
  props
) => {
  const { publicTimelines } = props;

  return (
    <Row className="my-2 justify-content-center">
      <Col sm="8" lg="6">
        <TimelineBoard timelines={publicTimelines} />
      </Col>
    </Row>
  );
};

export default TimelineBoardAreaWithoutUser;
