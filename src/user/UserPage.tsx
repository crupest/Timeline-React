import React from 'react';

import TimelinePage, { TimelinePageProps } from '../timeline/TimelinePage';
import UserInfoCard, { PersonalTimelineManageItem } from './UserInfoCard';

export type UserPageProps = TimelinePageProps<PersonalTimelineManageItem>;

const UserPage: React.FC<UserPageProps> = props => {
  return <TimelinePage {...props} CardComponent={UserInfoCard} />;
};

export default UserPage;
