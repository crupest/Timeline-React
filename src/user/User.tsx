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
  DialogContent,
  MenuList,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AxiosError } from 'axios';

import { fetchNickname, useUser, generateAvatarUrl } from '../data/user';

import AppBar from '../common/AppBar';
import OperationDialog from '../common/OperationDialog';

type EditItem = 'nickname' | 'avatar';

interface EditSelectDialogProps {
  open: boolean;
  close: () => void;
  onSelect: (item: EditItem) => void;
}

const EditSelectDialog: React.FC<EditSelectDialogProps> = props => {
  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>Edit what?</DialogTitle>
      <MenuList>
        <MenuItem
          onClick={() => {
            props.onSelect('nickname');
          }}
        >
          Nickname
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onSelect('avatar');
          }}
        >
          Avatar
        </MenuItem>
      </MenuList>
    </Dialog>
  );
};

interface ChangeNicknameDialogProps {
  open: boolean;
  close: () => void;
}

const ChangeNicknameDialog: React.FC<ChangeNicknameDialogProps> = props => {
  return (
    <OperationDialog
      open={props.open}
      title="Change nickname"
      titleColor="default"
      inputScheme={[{ type: 'text', label: 'new nickname' }]}
      onConfirm={async () => {}}
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
    fetchNickname(username).then(
      res => {
        setLoading(false);
        setNickname(res.data);
      },
      (error: AxiosError) => {
        setLoading(false);
        if (error.response && error.response.status === 404) {
          setError('User does not exist.');
        } else {
          setError(error.toString());
        }
      }
    );
  }, [username]);

  let body: React.ReactElement;
  let dialogElement: React.ReactElement | undefined;

  if (dialog === 'changenickname') {
    dialogElement = (
      <ChangeNicknameDialog
        open
        close={() => {
          setDialog(null);
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
