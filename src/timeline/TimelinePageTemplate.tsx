import React from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import concat from 'lodash/concat';
import without from 'lodash/without';

import { ExcludeKey } from '../type-utilities';
import { useUser, fetchUser } from '../data/user';
import { pushAlert } from '../common/alert-service';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  TimelineServiceTemplate,
  TimelineInfo,
  TimelineChangePropertyRequest,
} from '../data/timeline';

import { TimelinePostInfoEx, TimelineDeleteCallback } from './Timeline';
import { TimelineMemberDialog } from './TimelineMember';
import TimelinePropertyChangeDialog from './TimelinePropertyChangeDialog';
import { TimelinePageTemplateUIProps } from './TimelinePageTemplateUI';
import { TimelinePostSendCallback } from './TimelinePostEdit';

export interface TimelinePageTemplateProps<
  TManageItem,
  TTimeline extends TimelineInfo
> {
  name: string;
  onManage: (item: TManageItem) => void;
  service: TimelineServiceTemplate<TTimeline, TimelineChangePropertyRequest>;
  UiComponent: React.ComponentType<
    ExcludeKey<
      TimelinePageTemplateUIProps<TTimeline, TManageItem>,
      'CardComponent'
    >
  >;
  dataVersion?: number;
  notFoundI18nKey: string;
}

export default function TimelinePageTemplate<
  TManageItem,
  TTimeline extends TimelineInfo
>(
  props: TimelinePageTemplateProps<TManageItem, TTimeline>
): React.ReactElement | null {
  const { t } = useTranslation();

  const { name } = props;

  const user = useUser();

  const [dialog, setDialog] = React.useState<null | 'property' | 'member'>(
    null
  );
  const [timeline, setTimeline] = React.useState<TTimeline | undefined>(
    undefined
  );
  const [posts, setPosts] = React.useState<
    TimelinePostInfoEx[] | 'forbid' | undefined
  >(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const service = props.service;

  React.useEffect(() => {
    let subscribe = true;
    service.fetch(name).then(
      (ti) => {
        if (subscribe) {
          setTimeline(ti);
          if (!service.hasReadPermission(user, ti)) {
            setPosts('forbid');
          } else {
            service.fetchPosts(name).then(
              (data) => {
                if (subscribe) {
                  setPosts(
                    data.map((post) => ({
                      ...post,
                      deletable: service.hasModifyPostPermission(
                        user,
                        ti,
                        post
                      ),
                    }))
                  );
                }
              },
              (error) => {
                if (subscribe) {
                  setError(error.toString());
                }
              }
            );
          }
        }
      },
      (error: AxiosError) => {
        if (subscribe) {
          if (
            extractStatusCode(error) === 404 ||
            extractErrorCode(error) === 11020101
          ) {
            setError(t(props.notFoundI18nKey));
          } else {
            setError(error.toString());
          }
        }
      }
    );
    return () => {
      subscribe = false;
    };
  }, [name, service, user, t, props.dataVersion, props.notFoundI18nKey]);

  React.useEffect(() => {
    if (posts != null) {
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight
      );
    }
  }, [posts]);

  const closeDialog = React.useCallback((): void => {
    setDialog(null);
  }, []);

  let dialogElement: React.ReactElement | undefined;

  if (dialog === 'property') {
    dialogElement = (
      <TimelinePropertyChangeDialog
        open
        close={closeDialog}
        oldInfo={{
          visibility: timeline!.visibility,
          description: timeline!.description,
        }}
        onProcess={(req) => {
          return service.changeProperty(name, req).then((newTimeline) => {
            setTimeline(newTimeline);
          });
        }}
      />
    );
  } else if (dialog === 'member') {
    dialogElement = (
      <TimelineMemberDialog
        open
        onClose={closeDialog}
        members={[timeline!.owner, ...timeline!.members]}
        edit={
          service.hasManagePermission(user, timeline!)
            ? {
                onCheckUser: (u) => {
                  return fetchUser(u).catch((e) => {
                    if (
                      extractStatusCode(e) === 404 ||
                      extractErrorCode(e) === 11020101
                    ) {
                      return Promise.resolve(null);
                    } else {
                      return Promise.reject(e);
                    }
                  });
                },
                onAddUser: (u) => {
                  return service.addMember(name, u.username).then((_) => {
                    setTimeline({
                      ...timeline!,
                      members: concat(timeline!.members, u),
                    });
                  });
                },
                onRemoveUser: (u) => {
                  service.removeMember(name, u).then((_) => {
                    setTimeline({
                      ...timeline!,
                      members: without(
                        timeline!.members,
                        timeline!.members.find((m) => m.username === u)
                      ),
                    });
                  });
                },
              }
            : null
        }
      />
    );
  }

  const { UiComponent } = props;

  const onDelete: TimelineDeleteCallback = React.useCallback(
    (index, id) => {
      service.deletePost(name, id).then(
        (_) => {
          setPosts((oldPosts) =>
            without(
              oldPosts as TimelinePostInfoEx[],
              (oldPosts as TimelinePostInfoEx[])[index]
            )
          );
        },
        () => {
          pushAlert({
            type: 'danger',
            message: t('timeline.deletePostFailed'),
          });
        }
      );
    },
    [service, name, t]
  );

  const onPost: TimelinePostSendCallback = React.useCallback(
    (req) => {
      return service.createPost(name, req).then((newPost) => {
        setPosts((oldPosts) =>
          concat(oldPosts as TimelinePostInfoEx[], {
            ...newPost,
            deletable: true,
          })
        );
      });
    },
    [service, name]
  );

  const onManageProp = props.onManage;

  const onManage = React.useCallback(
    (item: 'property' | TManageItem) => {
      if (item === 'property') {
        setDialog(item);
      } else {
        onManageProp(item);
      }
    },
    [onManageProp]
  );

  const onMember = React.useCallback(() => {
    setDialog('member');
  }, []);

  return (
    <>
      <UiComponent
        error={error}
        timeline={timeline}
        posts={posts}
        onDelete={onDelete}
        onPost={
          timeline != null && service.hasPostPermission(user, timeline)
            ? onPost
            : undefined
        }
        onManage={
          timeline != null && service.hasManagePermission(user, timeline)
            ? onManage
            : undefined
        }
        onMember={onMember}
      />
      {dialogElement}
    </>
  );
}
