import React from 'react';

import { ExcludeKey } from '../type-utilities';
import { TimelineInfo } from '../data/timeline';

import TimelinePageTemplateUI, {
  TimelinePageTemplateUIProps
} from './TimelinePageTemplateUI';
import TimelineInfoCard, {
  OrdinaryTimelineManageItem
} from './TimelineInfoCard';

export type TimelinePageUIProps = ExcludeKey<
  TimelinePageTemplateUIProps<TimelineInfo, OrdinaryTimelineManageItem>,
  'CardComponent'
>;

const TimelinePageUI: React.FC<TimelinePageUIProps> = props => {
  return <TimelinePageTemplateUI {...props} CardComponent={TimelineInfoCard} />;
};

export default TimelinePageUI;
