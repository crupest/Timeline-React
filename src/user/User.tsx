import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import {
  CircularProgress,
  Typography,
  Card,
  IconButton,
  Icon,
  Dialog,
  DialogTitle,
  MenuList,
  MenuItem,
  Theme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { apiBaseUrl } from '../config';
import {
  fetchNickname,
  useUser,
  generateAvatarUrl,
  UserWithToken
} from '../data/user';
import { extractStatusCode, extractErrorCode } from '../data/common';
import {
  BaseTimelineInfo,
  fetchPersonalTimeline,
  TimelinePostInfo,
  canSee,
  fetchPersonalTimelinePosts,
  canPost,
  createPersonalTimelinePost
} from '../data/timeline';

import AppBar from '../common/AppBar';
import OperationDialog from '../common/OperationDialog';
import TimelineVisibilityIcon from '../timeline/TimelineVisibilityIcon';
import Timeline from '../timeline/Timeline';
import TimelinePropertyChangeDialog from '../timeline/TimelinePropertyChangeDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import TimelinePostEdit from '../timeline/TimelinePostEdit';

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
      onConfirm={async ([newNickname]) => {
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

const useStyles = makeStyles((theme: Theme) => ({
  fixHeight: {
    flexGrow: 0,
    flexShrink: 0
  },
  loadingBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorBody: {
    textAlign: 'center'
  },
  avatar: {
    height: 80
  },
  userInfoCard: {
    display: 'flex',
    margin: theme.spacing(1),
    position: 'relative'
  },
  userInfoBody: {
    padding: theme.spacing(1)
  },
  userInfoNickname: {
    display: 'inline-block'
  },
  userInfoUsername: {
    display: 'inline-block',
    padding: `0 ${theme.spacing(1)}px`
  },
  userInfoVisibilityIcon: {
    verticalAlign: 'text-top'
  },
  userInfoEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  timeline: {
    flex: '1 1 auto'
  }
}));

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();
  const classes = useStyles();
  const { t } = useTranslation();

  const user = useUser();

  const editable = user && (user.username === username || user.administrator);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<
    | null
    | 'editselect'
    | 'changenickname'
    | 'changeavatar'
    | 'changetimelineproperty'
  >(null);
  const [nickname, setNickname] = useState<string>();
  const [timelineInfo, setTimelineInfo] = useState<BaseTimelineInfo>();
  const [avatarKey, setAvatarKey] = useState<number>(0);

  const timelinePostable = useMemo<boolean>(
    () => canPost(user && user.username, timelineInfo),
    [user, timelineInfo]
  );

  interface TimelineStateLoading {
    type: 'load';
  }

  interface TimelineStateError {
    type: 'error';
    error: string;
  }

  interface TimelineStateDone {
    type: 'done';
    data: TimelinePostInfo[];
  }

  type TimelineState =
    | TimelineStateLoading
    | TimelineStateError
    | TimelineStateDone;

  const [timelineState, setTimelineState] = useState<TimelineState>({
    type: 'load'
  });

  useEffect(() => {
    let subscribe = true;
    Promise.all([
      fetchPersonalTimeline(username),
      fetchNickname(username)
    ]).then(
      ([res1, res2]) => {
        if (subscribe) {
          const ti = res1.data;
          setTimelineInfo(ti);
          setNickname(res2.data);
          setLoading(false);
          if (!canSee(user != null ? user.username : null, ti)) {
            setTimelineState({
              type: 'error',
              error: t('timeline.messageCantSee')
            });
          } else {
            fetchPersonalTimelinePosts(username, user && user.token).then(
              data => {
                if (subscribe) {
                  setTimelineState({
                    type: 'done',
                    data: data
                  });
                }
              },
              error => {
                if (subscribe) {
                  setTimelineState({
                    type: 'error',
                    error: 'Network error??????' //TODO! improve this error message
                  });
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
          setLoading(false);
        }
      }
    );
    return () => {
      subscribe = false;
    };
  }, [username]);

  let body: React.ReactElement;
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
          setNickname(newNickname);
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
        description={timelineInfo!.description}
        visibility={timelineInfo!.visibility}
        process={async req => {
          await axios.post(
            `${apiBaseUrl}/users/${username}/timeline/op/property?token=${
              user!.token
            }`,
            req
          );
          const newTimelineInfo: BaseTimelineInfo = { ...timelineInfo! };
          if (req.visibility != null) {
            newTimelineInfo.visibility = req.visibility;
          }
          if (req.description != null) {
            newTimelineInfo.description = req.description;
          }
          setTimelineInfo(newTimelineInfo);
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

  if (loading) {
    body = (
      <div className={classes.loadingBody}>
        <CircularProgress />
        <div>Loading...</div>
      </div>
    );
  } else {
    if (error) {
      body = (
        <Typography variant="h5" color="error" className={classes.errorBody}>
          An error occured: {error}
        </Typography>
      );
    } else {
      body = (
        <>
          <Card
            classes={{ root: clsx(classes.userInfoCard, classes.fixHeight) }}
          >
            <img
              key={avatarKey}
              className={classes.avatar}
              src={generateAvatarUrl(username)}
            />
            <div className={classes.userInfoBody}>
              <Typography variant="h6" className={classes.userInfoNickname}>
                {nickname}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.userInfoUsername}
              >
                @{username}
              </Typography>
              <TimelineVisibilityIcon
                className={classes.userInfoVisibilityIcon}
                visibility={timelineInfo!.visibility}
              />
              <Typography variant="body2">
                {timelineInfo!.description}
              </Typography>
            </div>
            {editable ? (
              <IconButton
                color="secondary"
                classes={{ root: classes.userInfoEditButton }}
                onClick={() => {
                  setDialog('editselect');
                }}
              >
                <Icon>edit</Icon>
              </IconButton>
            ) : (
              undefined
            )}
          </Card>
          {(() => {
            if (timelineState.type === 'load') {
              return <CircularProgress />;
            } else if (timelineState.type === 'error') {
              return (
                <Typography color="error">{timelineState.error}</Typography>
              );
            } else {
              return (
                <>
                  <Timeline
                    className={classes.timeline}
                    key={avatarKey}
                    posts={timelineState.data}
                  />
                  {timelinePostable && (
                    <TimelinePostEdit
                      className={classes.fixHeight}
                      onPost={async content => {
                        const newPost = await createPersonalTimelinePost(
                          username,
                          user!,
                          {
                            content: content
                          }
                        );
                        const posts = timelineState.data;
                        const newPostList = posts.slice();
                        newPostList.push(newPost);
                        setTimelineState({
                          type: 'done',
                          data: newPostList
                        });
                      }}
                    />
                  )}
                </>
              );
            }
          })()}
        </>
      );
    }
  }

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} className={classes.fixHeight}></div>
      {body}
      {dialogElement}
    </>
  );
};

export default User;
