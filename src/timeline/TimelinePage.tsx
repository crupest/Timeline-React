import React from 'react';
import { Spinner } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { TimelineInfo } from '../data/timeline';

import Timeline, {
  TimelinePostInfoEx,
  TimelineDeleteCallback
} from './Timeline';
import AppBar from '../common/AppBar';
import TimelinePostEdit, { TimelinePostSendCallback } from './TimelinePostEdit';

export interface TimelinePageProps<TEditItems> {
  avatarKey?: string | number;
  timeline?: TimelineInfo;
  posts?: TimelinePostInfoEx[] | 'forbid';
  CardComponent: React.ComponentType<{
    timeline: TimelineInfo;
    onManage?: (item: TEditItems) => void;
    onMember: () => void;
    className?: string;
    avatarKey?: string | number;
    onHeight?: (height: number) => void;
  }>;
  onMember: () => void;
  onManage?: (item: TEditItems) => void;
  onPost?: TimelinePostSendCallback;
  onDelete: TimelineDeleteCallback;
  error?: string;
}

function TimelinePage<TEditItems>(
  props: TimelinePageProps<TEditItems>
): React.ReactElement | null {
  const { t } = useTranslation();

  let body: React.ReactElement;

  if (props.error != null) {
    body = <p className="text-danger">{t(props.error)}</p>;
  } else {
    if (props.timeline != null) {
      let timelineBody: React.ReactElement;
      if (props.posts != null) {
        if (props.posts === 'forbid') {
          timelineBody = (
            <p className="text-danger">{t('timeline.messageCantSee')}</p>
          );
        } else {
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
                    const element = document.getElementById(
                      'page-bottom-space'
                    )!;
                    element.style.height = height + 'px';
                  }}
                />
              </>
            );
          }
        }
      } else {
        timelineBody = <Spinner />;
      }
      const { CardComponent } = props;

      body = (
        <>
          <CardComponent
            avatarKey={props.avatarKey}
            timeline={props.timeline}
            onManage={props.onManage}
            onMember={props.onMember}
            onHeight={(height: number) => {
              const element = document.getElementById('page-container')!;
              element.style.marginTop = 56 + 1 + height + 'px';
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
      <div id="page-container" className="mt-appbar">
        {body}
      </div>
    </>
  );
}

export default TimelinePage;
