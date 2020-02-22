import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

import { useUser, fetchUser } from '../data/user';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  personalTimelineService,
  PersonalTimelineInfo
} from '../data/timeline';
import { changeNickname, changeAvatar } from './http';

import { PersonalTimelineManageItem } from './EditItem';

import UserPage from './UserPage';
import ChangeNicknameDialog from './ChangeNicknameDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import { TimelinePostInfoEx } from '../timeline/Timeline';
import { TimelineMemberDialog } from '../timeline/TimelineMember';
import TimelinePropertyChangeDialog from '../timeline/TimelinePropertyChangeDialog';

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();

  const { t } = useTranslation();

  const user = useUser();

  const [dialog, setDialog] = useState<
    null | PersonalTimelineManageItem | 'member'
  >(null);
  const [timeline, setTimeline] = useState<PersonalTimelineInfo | undefined>(
    undefined
  );
  const [posts, setPosts] = useState<
    TimelinePostInfoEx[] | 'forbid' | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [avatarKey, setAvatarKey] = useState<number>(0);

  useEffect(() => {
    let subscribe = true;
    personalTimelineService.fetch(username).then(
      ti => {
        if (subscribe) {
          setTimeline(ti);
          if (!personalTimelineService.hasReadPermission(user, ti)) {
            setPosts('forbid');
          } else {
            personalTimelineService.fetchPosts(username).then(
              data => {
                if (subscribe) {
                  setPosts(
                    data.map(post => ({
                      ...post,
                      deletable: personalTimelineService.hasModifyPostPermission(
                        user,
                        ti,
                        post
                      )
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
  }, [username]);

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

  if (dialog === 'nickname') {
    dialogElement = (
      <ChangeNicknameDialog
        open
        close={closeDialogHandler}
        onProcess={newNickname => {
          const p = changeNickname(user!.token, username, newNickname);
          return p.then(u => {
            setTimeline({
              ...timeline!,
              owner: u
            });
          });
        }}
      />
    );
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
          return personalTimelineService
            .changeProperty(username, req)
            .then(newTimeline => {
              setTimeline(newTimeline);
            });
        }}
      />
    );
  } else if (dialog === 'avatar') {
    dialogElement = (
      <ChangeAvatarDialog
        open
        close={closeDialogHandler}
        process={file => {
          return changeAvatar(user!.token, username, file, file.type).then(
            _ => {
              setAvatarKey(avatarKey + 1);
            }
          );
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
          personalTimelineService.hasManagePermission(user, timeline!)
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
                  return personalTimelineService
                    .addMember(username, u.username)
                    .then(_ => {
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
                  personalTimelineService.removeMember(username, u).then(_ => {
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

  return (
    <>
      <UserPage
        avatarKey={avatarKey}
        error={error}
        timeline={timeline}
        posts={posts}
        onDelete={(index, id) => {
          personalTimelineService.deletePost(username, id).then(
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
          timeline != null &&
          personalTimelineService.hasPostPermission(user, timeline)
            ? content => {
                return personalTimelineService
                  .createPost(username, {
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
          timeline != null &&
          personalTimelineService.hasManagePermission(user, timeline)
            ? (item: PersonalTimelineManageItem) => {
                setDialog(item);
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
};

export default User;
