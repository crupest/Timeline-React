import React from 'react';

import { ExcludeKey } from '../type-utilities';
import { OrdinaryTimelineInfo } from '../data/timeline';

import TimelinePageTemplateUI, {
  TimelinePageTemplateUIProps
} from './TimelinePageTemplateUI';
import TimelineInfoCard, {
  OrdinaryTimelineManageItem
} from './TimelineInfoCard';

export type TimelinePageUIProps = ExcludeKey<
  TimelinePageTemplateUIProps<OrdinaryTimelineInfo, OrdinaryTimelineManageItem>,
  'CardComponent'
>;

const TimelinePageUI: React.FC<TimelinePageUIProps> = props => {
  return <TimelinePageTemplateUI {...props} CardComponent={TimelineInfoCard} />;
};

export default TimelinePageUI;
