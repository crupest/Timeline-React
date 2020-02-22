import React from 'react';
import { Spinner } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import Timeline, {
  TimelinePostInfoEx,
  TimelineDeleteCallback
} from './Timeline';
import AppBar from '../common/AppBar';
import TimelinePostEdit, { TimelinePostSendCallback } from './TimelinePostEdit';

export interface TimelinePageUIProps<TTimeline, TManageItems> {
  avatarKey?: string | number;
  timeline?: TTimeline;
  posts?: TimelinePostInfoEx[] | 'forbid';
  CardComponent: React.ComponentType<{
    timeline: TTimeline;
    onManage?: (item: TManageItems | 'property') => void;
    onMember: () => void;
    className?: string;
    onHeight?: (height: number) => void;
  }>;
  onMember: () => void;
  onManage?: (item: TManageItems | 'property') => void;
  onPost?: TimelinePostSendCallback;
  onDelete: TimelineDeleteCallback;
  error?: string;
}

export default function TimelinePageUI<TTimeline, TEditItems>(
  props: TimelinePageUIProps<TTimeline, TEditItems>
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
            <Timeline posts={props.posts} onDelete={props.onDelete} />
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