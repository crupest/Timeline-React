import React from 'react';

import { ExcludeKey } from '../type-utilities';
import { PersonalTimelineInfo } from '../data/timeline';

import TimelinePageTemplateUI, {
  TimelinePageTemplateUIProps
} from '../timeline/TimelinePageTemplateUI';
import UserInfoCard, { PersonalTimelineManageItem } from './UserInfoCard';

export type UserPageProps = ExcludeKey<
  TimelinePageTemplateUIProps<PersonalTimelineInfo, PersonalTimelineManageItem>,
  'CardComponent'
>;

const UserPage: React.FC<UserPageProps> = props => {
  return <TimelinePageTemplateUI {...props} CardComponent={UserInfoCard} />;
};

export default UserPage;
