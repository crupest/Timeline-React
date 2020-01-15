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

import {
  fetchNickname,
  useUser,
  generateAvatarUrl,
  getNickname
} from '../data/user';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  canSee,
  canDelete,
  canPost,
  fetchPersonalTimeline,
  fetchPersonalTimelinePosts,
  createPersonalTimelinePost,
  deletePersonalTimelinePost
} from '../data/timeline';
import { changeNickname, changeTimelineProperty, changeAvatar } from './http';

import { kEditItems, EditItem } from './EditItem';

import TimelinePropertyChangeDialog from '../timeline/TimelinePropertyChangeDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import UserPage, {
  UserPageUserInfoBase,
  UserPageTimelineBase
} from './UserPage';
import ChangeNicknameDialog from './ChangeNicknameDialog';
import { TimelineMemberDialog, UserInfo } from '../timeline/TimelineMember';

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

  interface UserInfoData extends UserPageUserInfoBase {
    members: string[];
  }

  const [dialog, setDialog] = useState<
    null | 'editselect' | EditItem | 'member'
  >(null);
  const [dialogData, setDialogData] = useState<unknown>(null);
  const [userInfo, setUserInfo] = useState<UserInfoData>();
  const [timeline, setTimeline] = useState<UserPageTimelineBase>();
  const [error, setError] = useState<string | undefined>(undefined);
  const [avatarKey, setAvatarKey] = useState<number>(0);

  useEffect(() => {
    let subscribe = true;
    Promise.all([
      fetchPersonalTimeline(username),
      fetchNickname(username)
    ]).then(
      ([res1, res2]) => {
        if (subscribe) {
          const ti = res1.data;
          if (!canSee(user?.username, ti)) {
            setError('timeline.messageCantSee');
          } else {
            setUserInfo({
              username: username,
              nickname: res2.data,
              avatarUrl: generateAvatarUrl(username),
              description: ti.description,
              timelineVisibility: ti.visibility,
              editable:
                user != null &&
                (user.username === username || user.administrator),
              members: ti.members
            });
            fetchPersonalTimelinePosts(username, user?.token).then(
              data => {
                if (subscribe) {
                  setTimeline({
                    posts: data.map(post => ({
                      ...post,
                      deletable: canDelete(
                        user && user.username,
                        username,
                        post.author
                      )
                    })),
                    postable: canPost(user?.username, ti)
                  });
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

  useEffect(() => {
    if (dialog === 'member') {
      if (userInfo == null) {
        throw new Error('No user info but open member dialog.');
      }
      setDialogData(null);
      Promise.all(
        userInfo.members.map(memberUsername => {
          return getNickname(memberUsername).then(
            memberNickname =>
              ({
                username: memberUsername,
                nickname: memberNickname,
                avatarUrl: generateAvatarUrl(memberUsername)
              } as UserInfo)
          );
        })
      ).then(members => {
        members.unshift(userInfo);
        setDialogData(members);
      });
    }
  }, [dialog]);

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
          p.then(_ => {
            setUserInfo({
              ...userInfo!,
              nickname: newNickname
            });
          });
          return p;
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
          visibility: userInfo!.timelineVisibility,
          description: userInfo!.description
        }}
        onProcess={async req => {
          await changeTimelineProperty(user!.token, username, req);
          const newUserInfo: UserInfoData = { ...userInfo! };
          if (req.visibility != null) {
            newUserInfo.timelineVisibility = req.visibility;
          }
          if (req.description != null) {
            newUserInfo.description = req.description;
          }
          setUserInfo(newUserInfo);
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
        members={dialogData as UserInfo[]}
        edit={
          userInfo!.editable
            ? {
                onCheckUser: u => {
                  return getNickname(u)
                    .catch(e => {
                      if (
                        extractStatusCode(e) === 404 ||
                        extractErrorCode(e) === 11020101
                      ) {
                        return null;
                      } else {
                        Promise.reject(e);
                      }
                    })
                    .then(nickname => {
                      return nickname === null
                        ? null
                        : ({
                            username: u,
                            nickname: nickname,
                            avatarUrl: generateAvatarUrl(u)
                          } as UserInfo);
                    });
                }
                // TODO!!!
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
        userInfo={
          userInfo != null
            ? {
                ...userInfo,
                onEdit: () => {
                  setDialog('editselect');
                },
                onMember: () => {
                  setDialog('member');
                }
              }
            : undefined
        }
        timeline={
          timeline != null
            ? {
                ...timeline,
                onDelete: (index, id) => {
                  deletePersonalTimelinePost(username, id, user!.token).then(
                    _ => {
                      const newPosts = timeline.posts.slice();
                      newPosts.splice(index, 1);
                      setTimeline({
                        ...timeline,
                        posts: newPosts
                      });
                    },
                    () => {
                      setSnackBar('Failed to delete post.'); // TODO: Translation
                    }
                  );
                },
                onPost: async content => {
                  const newPost = await createPersonalTimelinePost(
                    username,
                    user!,
                    {
                      content: content
                    }
                  );
                  const posts = timeline.posts;
                  const newPostList = posts.slice();
                  newPostList.push({
                    ...newPost,
                    deletable: true
                  });
                  setTimeline({
                    ...timeline,
                    posts: newPostList
                  });
                }
              }
            : undefined
        }
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
