import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Button,
  Dialog,
  DialogTitle,
  MenuList,
  MenuItem,
  Snackbar
} from '@material-ui/core';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { useUser, fetchUser } from '../data/user';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  canSee,
  canModifyPost,
  canPost,
  fetchPersonalTimeline,
  fetchPersonalTimelinePosts,
  createPersonalTimelinePost,
  deletePersonalTimelinePost,
  canManage,
  BaseTimelineInfo,
  addPersonalTimelineMember,
  removePersonalTimelineMember
} from '../data/timeline';
import { changeNickname, changeTimelineProperty, changeAvatar } from './http';

import { kEditItems, EditItem } from './EditItem';

import TimelinePropertyChangeDialog from '../timeline/TimelinePropertyChangeDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import UserPage from './UserPage';
import ChangeNicknameDialog from './ChangeNicknameDialog';
import { TimelineMemberDialog } from '../timeline/TimelineMember';
import { TimelinePostInfoEx } from '../timeline/Timeline';

interface EditSelectDialogProps {
  open: boolean;
  close: () => void;
  onSelect: (item: EditItem) => void;
}

const EditSelectDialog: React.FC<EditSelectDialogProps> = props => {
  const { t } = useTranslation();
  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle> {t('userPage.dialogEditSelect.title')}</DialogTitle>
      <MenuList>
        {kEditItems.map(v => (
          <MenuItem
            key={v}
            onClick={() => {
              props.onSelect(v);
            }}
          >
            {t(`userPage.dialogEditSelect.${v}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Dialog>
  );
};

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();

  const user = useUser();

  const [dialog, setDialog] = useState<
    null | 'editselect' | EditItem | 'member'
  >(null);
  const [timeline, setTimeline] = useState<BaseTimelineInfo | undefined>(
    undefined
  );
  const [posts, setPosts] = useState<TimelinePostInfoEx[] | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [avatarKey, setAvatarKey] = useState<number>(0);

  useEffect(() => {
    let subscribe = true;
    fetchPersonalTimeline(username).then(
      res => {
        if (subscribe) {
          const ti = res.data;
          if (!canSee(user, ti)) {
            setError('timeline.messageCantSee');
          } else {
            setTimeline(ti);
            fetchPersonalTimelinePosts(username, user?.token).then(
              data => {
                if (subscribe) {
                  setPosts(
                    data.map(post => ({
                      ...post,
                      deletable: canModifyPost(user, ti, post)
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
            setError('User does not exist.');
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
    if (timeline != null) {
      window.scrollTo(
        0,
        document.body.scrollHeight || document.documentElement.scrollHeight
      );
    }
  }, [timeline]);

  const [snackBar, setSnackBar] = useState<string | null>(null);

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
  } else if (dialog === 'editselect') {
    dialogElement = (
      <EditSelectDialog
        open
        close={closeDialogHandler}
        onSelect={item => {
          setDialog(item);
        }}
      />
    );
  } else if (dialog === 'timelineproperty') {
    dialogElement = (
      <TimelinePropertyChangeDialog
        open
        close={closeDialogHandler}
        oldInfo={{
          visibility: timeline!.visibility,
          description: timeline!.description
        }}
        onProcess={async req => {
          const newTimeline = await changeTimelineProperty(
            user!.token,
            username,
            req
          );
          setTimeline(newTimeline);
        }}
      />
    );
  } else if (dialog === 'avatar') {
    dialogElement = (
      <ChangeAvatarDialog
        open
        close={closeDialogHandler}
        process={async file => {
          await changeAvatar(user!.token, username, file, file.type);
          setAvatarKey(avatarKey + 1);
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
          canManage(user, timeline!)
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
                  return addPersonalTimelineMember(
                    username,
                    u.username,
                    user!.token
                  ).then(_ => {
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
                  removePersonalTimelineMember(username, u, user!.token).then(
                    _ => {
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
                    }
                  );
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
        manageable={timeline != null && canManage(user, timeline)}
        postable={timeline != null && canPost(user, timeline)}
        onDelete={(index, id) => {
          deletePersonalTimelinePost(username, id, user!.token).then(
            _ => {
              const newPosts = posts!.slice();
              newPosts.splice(index, 1);
              setPosts(newPosts);
            },
            () => {
              setSnackBar('Failed to delete post.'); // TODO: Translation
            }
          );
        }}
        onPost={async content => {
          const newPost = await createPersonalTimelinePost(username, user!, {
            content: content
          });
          const newPosts = posts!.slice();
          newPosts.push({
            ...newPost,
            deletable: true
          });
          setPosts(newPosts);
        }}
        onManage={() => {
          setDialog('editselect');
        }}
        onMember={() => {
          setDialog('member');
        }}
      />
      {dialogElement}
      {snackBar && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => {
            setSnackBar(null);
          }}
          message={snackBar}
          action={
            <Button
              onClick={() => {
                setSnackBar(null);
              }}
              color="secondary"
            >
              ok!
            </Button> // TODO! Translation
          }
        />
      )}
    </>
  );
};

export default User;
