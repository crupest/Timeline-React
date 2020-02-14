import React from 'react';
import { from } from 'rxjs';
import { useTranslation } from 'react-i18next';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';
import { Row, Col, Container } from 'reactstrap';

interface TimelineBoardAreaWithoutUserProps {
  fetch: () => Promise<TimelineInfo[]>;
}

const TimelineBoardAreaWithoutUser: React.FC<TimelineBoardAreaWithoutUserProps> = props => {
  const { t } = useTranslation();

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
    <Container className="p-3">
      <TimelineBoard title={t('home.allTimeline')} timelines={timelines} />
    </Container>
  );
};

export default TimelineBoardAreaWithoutUser;
