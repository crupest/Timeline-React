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
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import axios, { AxiosError } from 'axios';

import {
  fetchNickname,
  useUser,
  generateAvatarUrl,
  UserWithToken
} from '../data/user';

import AppBar from '../common/AppBar';
import OperationDialog from '../common/OperationDialog';
import { useTranslation } from 'react-i18next';
import { apiBaseUrl } from '../config';

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

const useStyles = makeStyles({
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
    margin: '10px',
    position: 'relative'
  },
  userInfoBody: {},
  userInfoNickname: {
    display: 'inline-block',
    padding: ' 0 10px'
  },
  userInfoUsername: {
    display: 'inline-block'
  },
  userInfoEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
});

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

  useEffect(() => {
    let subscribe = true;
    fetchNickname(username).then(
      res => {
        if (subscribe) {
          setLoading(false);
          setNickname(res.data);
        }
      },
      (error: AxiosError) => {
        if (subscribe) {
          setLoading(false);
          if (error.response && error.response.status === 404) {
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
        <Card classes={{ root: classes.userInfoCard }}>
          <img className={classes.avatar} src={generateAvatarUrl(username)} />
          <div className={classes.userInfoBody}>
            <div className={classes.userInfoNickname}>
              <Typography variant="h6" className={classes.userInfoNickname}>
                {nickname}
              </Typography>
            </div>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.userInfoUsername}
            >
              @{username}
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
