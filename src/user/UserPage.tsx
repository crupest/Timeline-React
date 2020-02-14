import React from 'react';
import { useTranslation } from 'react-i18next';

import { PersonalTimelineInfo } from '../data/timeline';

import Timeline, {
  TimelinePostInfoEx,
  TimelineDeleteCallback
} from '../timeline/Timeline';
import AppBar from '../common/AppBar';
import UserInfoCard, { UserInfoCardProps } from './UserInfoCard';
import TimelinePostEdit, {
  TimelinePostSendCallback
} from '../timeline/TimelinePostEdit';
import { Spinner, Container } from 'reactstrap';

export interface UserPageProps {
  avatarKey?: string | number;
  timeline?: PersonalTimelineInfo;
  posts?: TimelinePostInfoEx[];
  onMember: () => void;
  onManage?: UserInfoCardProps['onManage'];
  onPost?: TimelinePostSendCallback;
  onDelete: TimelineDeleteCallback;
  error?: string;
}

const UserPage: React.FC<UserPageProps> = props => {
  const { t } = useTranslation();

  let body: React.ReactElement;

  if (props.error != null) {
    body = <p color="error">{t(props.error)}</p>;
  } else {
    if (props.timeline != null) {
      let timelineBody: React.ReactElement;
      if (props.posts != null) {
        timelineBody = (
          <Timeline
            avatarKey={props.avatarKey}
            posts={props.posts}
            onDelete={props.onDelete}
          />
        );
        if (props.onPost != null) {
          timelineBody = (
            <>
              {timelineBody}
              <div id="page-bottom-space" className="flex-fix-length" />
              <TimelinePostEdit
                onPost={props.onPost}
                onHeightChange={height => {
                  const element = document.getElementById('page-bottom-space')!;
                  element.style.height = height + 'px';
                }}
              />
            </>
          );
        }
      } else {
        timelineBody = <Spinner />;
      }
      body = (
        <>
          <UserInfoCard
            avatarKey={props.avatarKey}
            timeline={props.timeline}
            onManage={props.onManage}
            onMember={props.onMember}
            onHeight={height => {
              const element = document.getElementById('page-container')!;
              element.style.marginTop = 56 + height + 'px';
            }}
            className="fixed-top mt-appbar"
          />
          {timelineBody}
        </>
      );
    } else {
      body = <Spinner />;
    }
  }

  return (
    <>
      <AppBar />
      <Container fluid id="page-container">
        {body}
      </Container>
    </>
  );
};

export default UserPage;
