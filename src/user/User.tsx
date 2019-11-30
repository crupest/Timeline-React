import React, { useEffect, useState } from 'react';
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
  fetchTimeline,
  TimelinePostInfo
} from '../data/timeline';

import AppBar from '../common/AppBar';
import OperationDialog from '../common/OperationDialog';
import TimelineVisibilityIcon from '../timeline/TimelineVisibilityIcon';
import Timeline from '../timeline/Timeline';

const mockPosts: TimelinePostInfo[] = [
  {
    id: 1,
    content: 'hahahaha',
    time: new Date(2019, 11, 27, 15, 30, 30),
    author: 'crupest'
  },
  {
    id: 2,
    content: 'hohohohoho',
    time: new Date(2019, 11, 28, 15, 30, 30),
    author: 'crupest'
  }
];

type EditItem = 'nickname' | 'avatar';

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
  loadingBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorBody: {
    textAlign: 'center'
  },
  avatar: {
    height: 80,
    borderRadius: '50%'
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
  }
}));

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();
  const classes = useStyles();

  const user = useUser();

  const editable = user && (user.username === username || user.administrator);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<null | 'editselect' | 'changenickname'>(
    null
  );
  const [nickname, setNickname] = useState<string>();
  const [timelineInfo, setTimelineInfo] = useState<BaseTimelineInfo>();

  useEffect(() => {
    let subscribe = true;
    Promise.all([
      fetchTimeline(`${apiBaseUrl}/users/${username}/timeline`),
      fetchNickname(username)
    ]).then(
      ([res1, res2]) => {
        if (subscribe) {
          setTimelineInfo(res1.data);
          setNickname(res2.data);
          setLoading(false);
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

  if (dialog === 'changenickname') {
    dialogElement = (
      <ChangeNicknameDialog
        open
        user={user!}
        close={() => {
          setDialog(null);
        }}
        onChanged={newNickname => {
          setNickname(newNickname);
        }}
      />
    );
  } else if (dialog === 'editselect') {
    dialogElement = (
      <EditSelectDialog
        open
        close={() => {
          setDialog(null);
        }}
        onSelect={item => {
          if (item === 'nickname') {
            setDialog('changenickname');
          } else {
            setDialog(null);
          }
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
          <Card classes={{ root: classes.userInfoCard }}>
            <img className={classes.avatar} src={generateAvatarUrl(username)} />
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
          <Timeline posts={mockPosts} />
        </>
      );
    }
  }

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }}></div>
      {body}
      {dialogElement}
    </>
  );
};

export default User;
