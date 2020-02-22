import React from 'react';
import { useParams } from 'react-router';

import { ordinaryTimelineService } from '../data/timeline';

import TimelinePageUI from './TimelinePageUI';
import TimelinePageTemplate from '../timeline/TimelinePageTemplate';

const TimelinePage: React.FC = _ => {
  const { name } = useParams<{ name: string }>();

  return (
    <TimelinePageTemplate
      name={name}
      UiComponent={TimelinePageUI}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onManage={_ => {}}
      service={ordinaryTimelineService}
    />
  );
};

export default TimelinePage;
