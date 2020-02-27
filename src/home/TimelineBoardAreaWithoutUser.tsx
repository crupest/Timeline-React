import React from 'react';
import { Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';

interface TimelineBoardAreaWithoutUserProps {
  publicTimelines?: TimelineInfo[];
}

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = props => {
  const { t } = useTranslation();

  return (
    <Container className="p-3">
      <TimelineBoard
        title={t('home.allTimeline')}
        timelines={props.publicTimelines}
      />
    </Container>
  );
};

export default TimelineBoardAreaWithoutUser;
