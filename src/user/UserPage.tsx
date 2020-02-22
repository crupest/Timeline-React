import React from 'react';

import { ExcludeKey } from '../type-utilities';
import { PersonalTimelineInfo } from '../data/timeline';

import TimelinePageUI, {
  TimelinePageUIProps
} from '../timeline/TimelinePageUI';
import UserInfoCard, { PersonalTimelineManageItem } from './UserInfoCard';

export type UserPageProps = ExcludeKey<
  TimelinePageUIProps<PersonalTimelineInfo, PersonalTimelineManageItem>,
  'CardComponent'
>;

const UserPage: React.FC<UserPageProps> = props => {
  return <TimelinePageUI {...props} CardComponent={UserInfoCard} />;
};

export default UserPage;
