import React from 'react';

import { OrdinaryTimelineInfo } from '../data/timeline';
import { TimelineMemberCallbacks } from '../timeline/TimelineMember';
import { Card, CardHeader } from '@material-ui/core';

export interface TimelineInfoEditCallbacks extends TimelineMemberCallbacks {
  onEditInfo: () => void;
}

interface TimelineInfoCardProps {
  timeline: OrdinaryTimelineInfo;
  manageCallbacks?: TimelineInfoEditCallbacks;
}

const TimelineInfoCard: React.FC<TimelineInfoCardProps> = props => {
  return (
    <Card>
      <CardHeader title={props.timeline.name} />
    </Card>
  );
};

export default TimelineInfoCard;
