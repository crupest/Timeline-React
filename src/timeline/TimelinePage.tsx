import React from 'react';
import { useParams } from 'react-router';

import { ordinaryTimelineService } from '../data/timeline';

import TimelinePageUI from './TimelinePageUI';
import TimelinePageTemplate from '../timeline/TimelinePageTemplate';
import { OrdinaryTimelineManageItem } from './TimelineInfoCard';
import TimelineDeleteDialog from './TimelineDeleteDialog';

const TimelinePage: React.FC = _ => {
  const { name } = useParams<{ name: string }>();

  const [dialog, setDialog] = React.useState<OrdinaryTimelineManageItem | null>(
    null
  );

  let dialogElement: React.ReactElement | undefined;
  if (dialog === 'delete') {
    dialogElement = (
      <TimelineDeleteDialog open close={() => setDialog(null)} name={name} />
    );
  }

  return (
    <>
      <TimelinePageTemplate
        name={name}
        UiComponent={TimelinePageUI}
        onManage={item => setDialog(item)}
        service={ordinaryTimelineService}
        notFoundI18nKey="timeline.timelineNotExist"
      />
      {dialogElement}
    </>
  );
};

export default TimelinePage;
