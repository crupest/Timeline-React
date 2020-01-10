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
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import { apiBaseUrl } from '../config';
import {
  fetchNickname,
  useUser,
  generateAvatarUrl,
  UserWithToken
} from '../data/user';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  fetchPersonalTimeline,
  canSee,
  fetchPersonalTimelinePosts,
  canPost,
  createPersonalTimelinePost,
  canDelete,
  deletePersonalTimelinePost
} from '../data/timeline';

import OperationDialog from '../common/OperationDialog';
import TimelinePropertyChangeDialog from '../timeline/TimelinePropertyChangeDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import UserPage, {
  UserPageUserInfoBase,
  UserPageTimelineBase
} from './UserPage';

type EditItem = 'nickname' | 'avatar' | 'timelineproperty';

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
        <MenuItem
          onClick={() => {
            props.onSelect('nickname');
          }}
        >
          {t('userPage.dialogEditSelect.nickname')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onSelect('avatar');
          }}
        >
          {t('userPage.dialogEditSelect.avatar')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onSelect('timelineproperty');
          }}
        >
          {t('userPage.dialogEditSelect.timelineProperty')}
        </MenuItem>
      </MenuList>
    </Dialog>
  );
};

function changeNickname(
  username: string,
  newNickname: string,
  token: string
): Promise<void> {
  return axios.put(
    `${apiBaseUrl}/users/${username}/nickname?token=${token}`,
    newNickname,
    {
      headers: {
        'Content-Type': 'text/plain'
      }
    }
  );
}

interface ChangeNicknameDialogProps {
  user: UserWithToken;
  open: boolean;
  close: () => void;
  onChanged: (newNickname: string) => void;
}

const ChangeNicknameDialog: React.FC<ChangeNicknameDialogProps> = props => {
  const { t } = useTranslation();
  return (
    <OperationDialog
      open={props.open}
      title={t('userPage.dialogChangeNickname.title')}
      titleColor="default"
      inputScheme={[
        { type: 'text', label: t('userPage.dialogChangeNickname.inputLabel') }
      ]}
      onProcess={async ([newNickname]) => {
        await changeNickname(
          props.user.username,
          newNickname as string,
          props.user.token
        );
        props.onChanged(newNickname as string);
      }}
      close={props.close}
    />
  );
};

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();

  const user = useUser();

  const [dialog, setDialog] = useState<
    | null
    | 'editselect'
    | 'changenickname'
    | 'changeavatar'
    | 'changetimelineproperty'
  >(null);
  const [userInfo, setUserInfo] = useState<UserPageUserInfoBase>();
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
                (user.username === username || user.administrator)
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

  const [snackBar, setSnackBar] = useState<string | null>(null);

  let dialogElement: React.ReactElement | undefined;

  const closeDialogHandler = (): void => {
    setDialog(null);
  };

  if (dialog === 'changenickname') {
    dialogElement = (
      <ChangeNicknameDialog
        open
        user={user!}
        close={closeDialogHandler}
        onChanged={newNickname => {
          setUserInfo({
            ...userInfo!,
            nickname: newNickname
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
          if (item === 'nickname') {
            setDialog('changenickname');
          } else if (item === 'timelineproperty') {
            setDialog('changetimelineproperty');
          } else if (item === 'avatar') {
            setDialog('changeavatar');
          } else {
            setDialog(null);
          }
        }}
      />
    );
  } else if (dialog === 'changetimelineproperty') {
    dialogElement = (
      <TimelinePropertyChangeDialog
        open
        close={closeDialogHandler}
        description={userInfo!.description}
        visibility={userInfo!.timelineVisibility}
        process={async req => {
          await axios.post(
            `${apiBaseUrl}/users/${username}/timeline/op/property?token=${
              user!.token
            }`,
            req
          );
          const newUserInfo: UserPageUserInfoBase = { ...userInfo! };
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
  } else if (dialog === 'changeavatar') {
    dialogElement = (
      <ChangeAvatarDialog
        open
        close={closeDialogHandler}
        process={async file => {
          await axios.put(
            `${apiBaseUrl}/users/${username}/avatar?token=${user!.token}`,
            file,
            {
              headers: {
                'Content-Type': file.type
              }
            }
          );
          setAvatarKey(avatarKey + 1);
        }}
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
