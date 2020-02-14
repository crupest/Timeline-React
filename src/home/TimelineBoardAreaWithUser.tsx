import React from 'react';
import { from } from 'rxjs';
import { useTranslation } from 'react-i18next';

import TimelineBoard from './TimelineBoard';
import { TimelineInfo } from '../data/timeline';
import { Row, Col } from 'reactstrap';

interface TimelineBoardAreaWithUserProps {
  fetchOwn: () => Promise<TimelineInfo[]>;
  fetchJoin: () => Promise<TimelineInfo[]>;
}

const TimelineBoardAreaWithUser: React.FC<TimelineBoardAreaWithUserProps> = props => {
  const { t } = useTranslation();

  const [ownTimelines, setOwnTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);
  const [joinTimelines, setJoinTimelines] = React.useState<
    TimelineInfo[] | undefined
  >(undefined);

  React.useEffect(() => {
    const subscription = from(props.fetchOwn()).subscribe(ts => {
      setOwnTimelines(ts);
    });
    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const subscription = from(props.fetchJoin()).subscribe(ts => {
      setJoinTimelines(ts);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Row>
      <Col className="col-12 col-sm-6 py-2">
        <TimelineBoard title={t('home.ownTimeline')} timelines={ownTimelines} />
      </Col>
      <Col className="col-12 col-sm-6 py-2">
        <TimelineBoard
          title={t('home.joinTimeline')}
          timelines={joinTimelines}
        />
      </Col>
    </Row>
  );
};

export default TimelineBoardAreaWithUser;
