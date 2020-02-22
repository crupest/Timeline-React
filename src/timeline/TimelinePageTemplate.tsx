import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

import { ExcludeKey } from '../type-utilities';
import { useUser, fetchUser } from '../data/user';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  TimelineServiceTemplate,
  TimelineInfo,
  TimelineChangePropertyRequest
} from '../data/timeline';

import { TimelinePostInfoEx } from './Timeline';
import { TimelineMemberDialog } from './TimelineMember';
import TimelinePropertyChangeDialog from './TimelinePropertyChangeDialog';
import { TimelinePageTemplateUIProps } from './TimelinePageTemplateUI';

export interface TimelinePageTemplateProps<
  TManageItem,
  TTimeline extends TimelineInfo
> {
  name: string;
  onManage: (item: TManageItem) => void;
  service: TimelineServiceTemplate<TTimeline, TimelineChangePropertyRequest>;
  UiComponent: React.ComponentType<
    ExcludeKey<TimelinePageTemplateUIProps<TTimeline, TManageItem>, 'CardComponent'>
  >;
  dialog?: React.ReactElement;
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

  const [dialog, setDialog] = useState<null | 'property' | 'member'>(null);
  const [timeline, setTimeline] = useState<TTimeline | undefined>(undefined);
  const [posts, setPosts] = useState<
    TimelinePostInfoEx[] | 'forbid' | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const service = props.service;

  useEffect(() => {
    let subscribe = true;
    service.fetch(name).then(
      ti => {
        if (subscribe) {
          setTimeline(ti);
          if (!service.hasReadPermission(user, ti)) {
            setPosts('forbid');
          } else {
            service.fetchPosts(name).then(
              data => {
                if (subscribe) {
                  setPosts(
                    data.map(post => ({
                      ...post,
                      deletable: service.hasModifyPostPermission(user, ti, post)
                    }))
                  );
                }
              },
              error => {
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
            setError(t('timeline.userNotExist'));
          } else {
            setError(error.toString());
          }
        }
      }
    );
    return () => {
      subscribe = false;
    };
  }, [name]);

  useEffect(() => {
    if (posts != null) {
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight
      );
    }
  }, [posts]);

  let dialogElement: React.ReactElement | undefined;

  const closeDialogHandler = (): void => {
    setDialog(null);
  };

  if (props.dialog != null) {
    dialogElement = props.dialog;
  } else if (dialog === 'property') {
    dialogElement = (
      <TimelinePropertyChangeDialog
        open
        close={closeDialogHandler}
        oldInfo={{
          visibility: timeline!.visibility,
          description: timeline!.description
        }}
        onProcess={req => {
          return service.changeProperty(name, req).then(newTimeline => {
            setTimeline(newTimeline);
          });
        }}
      />
    );
  } else if (dialog === 'member') {
    dialogElement = (
      <TimelineMemberDialog
        open
        onClose={closeDialogHandler}
        members={[timeline!.owner, ...timeline!.members]}
        edit={
          service.hasManagePermission(user, timeline!)
            ? {
                onCheckUser: u => {
                  return fetchUser(u).catch(e => {
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
                onAddUser: u => {
                  return service.addMember(name, u.username).then(_ => {
                    const oldMembers = timeline!.members;
                    const newMembers = oldMembers.slice();
                    newMembers.push(u);
                    setTimeline({
                      ...timeline!,
                      members: newMembers
                    });
                  });
                },
                onRemoveUser: u => {
                  service.removeMember(name, u).then(_ => {
                    const oldMembers = timeline!.members;
                    const newMembers = oldMembers.slice();
                    newMembers.splice(
                      newMembers.findIndex(m => m.username === u),
                      1
                    );
                    setTimeline({
                      ...timeline!,
                      members: newMembers
                    });
                  });
                }
              }
            : null
        }
      />
    );
  }
  const { UiComponent } = props;

  return (
    <>
      <UiComponent
        error={error}
        timeline={timeline}
        posts={posts}
        onDelete={(index, id) => {
          service.deletePost(name, id).then(
            _ => {
              const newPosts = (posts as TimelinePostInfoEx[]).slice();
              newPosts.splice(index, 1);
              setPosts(newPosts);
            },
            () => {
              // TODO: Do something.
            }
          );
        }}
        onPost={
          timeline != null && service.hasPostPermission(user, timeline)
            ? content => {
                return service
                  .createPost(name, {
                    content: content
                  })
                  .then(newPost => {
                    const newPosts = (posts as TimelinePostInfoEx[]).slice();
                    newPosts.push({
                      ...newPost,
                      deletable: true
                    });
                    setPosts(newPosts);
                  });
              }
            : undefined
        }
        onManage={
          timeline != null && service.hasManagePermission(user, timeline)
            ? (item: 'property' | TManageItem) => {
                if (item === 'property') {
                  setDialog(item);
                } else {
                  props.onManage(item);
                }
              }
            : undefined
        }
        onMember={() => {
          setDialog('member');
        }}
      />
      {dialogElement}
    </>
  );
}
