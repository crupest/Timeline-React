import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  CircularProgress,
  Typography,
  Card,
  IconButton,
  Icon
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AxiosError } from 'axios';

import { fetchNickname, useUser, generateAvatarUrl } from '../data/user';

import AppBar from '../common/AppBar';

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
    margin: '10px'
  },
  userInfoAvatarArea: {
    display: 'flex',
  },
  userInfoAvatarEditButton: {
    alignSelf: 'flex-end',
    marginLeft: -20
  },
  userInfoBody: {},
  userInfoNickname: {
    display: 'inline-block',
    padding: ' 0 10px'
  },
  userInfoUsername: {
    display: 'inline-block'
  }
});

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();
  const classes = useStyles();

  const user = useUser();

  const editable = user && (user.username === username || user.administrator);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
          <div className={classes.userInfoAvatarArea}>
            <img className={classes.avatar} src={generateAvatarUrl(username)} />
            {editable ? (
              <IconButton className={classes.userInfoAvatarEditButton} size="small">
                <Icon>edit</Icon>
              </IconButton>
            ) : (
              undefined
            )}
          </div>
          <div className={classes.userInfoBody}>
            <div className={classes.userInfoNickname}>
              <Typography variant="h6" style={{ display: 'inline' }}>
                {nickname}
              </Typography>
              {editable ? (
                <IconButton size="small">
                  <Icon>edit</Icon>
                </IconButton>
              ) : (
                undefined
              )}
            </div>
            <Typography
              variant="caption"
              color="textSecondary"
              className={classes.userInfoUsername}
            >
              @{username}
            </Typography>
          </div>
        </Card>
      );
    }
  }

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }}></div>
      {body}
    </>
  );
};

export default User;