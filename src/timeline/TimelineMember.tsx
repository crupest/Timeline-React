import React, { useState } from 'react';
import {
  Avatar,
  CircularProgress,
  Dialog,
  Divider,
  makeStyles,
  Theme,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  IconButton,
  Icon
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import SearchInput from '../common/SearchInput';

export interface UserInfo {
  username: string;
  nickname: string;
  avatarUrl: string;
}

export interface TimelineMemberProps {
  members: UserInfo[] | null;
  edit: {
    onCheckUser: (username: string) => Promise<UserInfo | null>;
    onAddUser: (user: UserInfo) => Promise<void>;
    onRemoveUser: (username: string) => void;
  } | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  memberList: {
    minHeight: 100,
    maxHeight: '50vh',
    overflowY: 'auto'
  },
  addArea: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1)
  },
  errorText: {
    alignSelf: 'center'
  }
}));

const TimelineMember: React.FC<TimelineMemberProps> = props => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [userSearchText, setUserSearchText] = useState<string>('');
  const [userSearchState, setUserSearchState] = useState<
    | {
        type: 'user';
        data: UserInfo;
      }
    | { type: 'error'; data: string }
    | { type: 'loading' }
    | { type: 'init' }
  >({ type: 'init' });

  const members = props.members;
  if (members == null) {
    return <CircularProgress />;
  }

  return (
    <div className={classes.container}>
      <List classes={{ root: classes.memberList }} dense>
        {members.map((member, index) => (
          <ListItem key={member.username} dense>
            <ListItemAvatar>
              <Avatar src={member.avatarUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={member.nickname}
              secondary={'@' + member.username}
            />
            {(() => {
              if (index === 0) {
                return null;
              }
              const onRemove = props.edit?.onRemoveUser;
              if (onRemove == null) {
                return null;
              }
              return (
                <IconButton
                  color="secondary"
                  onClick={() => {
                    onRemove(member.username);
                  }}
                >
                  <Icon>remove</Icon>
                </IconButton>
              );
            })()}
          </ListItem>
        ))}
      </List>
      {(() => {
        const edit = props.edit;
        if (edit != null) {
          return (
            <>
              <Divider />
              <div className={classes.addArea}>
                <SearchInput
                  value={userSearchText}
                  onChange={v => {
                    setUserSearchText(v);
                  }}
                  loading={userSearchState.type === 'loading'}
                  onButtonClick={() => {
                    setUserSearchState({ type: 'loading' });
                    edit.onCheckUser(userSearchText).then(
                      u => {
                        if (u == null) {
                          setUserSearchState({
                            type: 'error',
                            data: 'timeline.userNotExist'
                          });
                        } else {
                          setUserSearchState({ type: 'user', data: u });
                        }
                      },
                      e => {
                        setUserSearchState({
                          type: 'error',
                          data: e.toString()
                        });
                      }
                    );
                  }}
                />
                {(() => {
                  if (userSearchState.type === 'user') {
                    const u = userSearchState.data;
                    const addable =
                      members.findIndex(m => m.username === u.username) === -1;
                    return (
                      <>
                        {!addable ? (
                          <Typography
                            color="error"
                            className={classes.errorText}
                          >
                            {t('timeline.member.alreadyMember')}
                          </Typography>
                        ) : null}
                        <ListItem dense>
                          <ListItemAvatar>
                            <Avatar src={u.avatarUrl} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={u.nickname}
                            secondary={'@' + u.username}
                          />
                          <IconButton
                            edge="end"
                            disabled={!addable}
                            onClick={() => {
                              edit.onAddUser(u).then(_ => {
                                setUserSearchText('');
                                setUserSearchState({ type: 'init' });
                              });
                            }}
                            color="primary"
                          >
                            <Icon>add</Icon>
                          </IconButton>
                        </ListItem>
                      </>
                    );
                  } else if (userSearchState.type === 'error') {
                    return (
                      <Typography color="error" className={classes.errorText}>
                        {t(userSearchState.data)}
                      </Typography>
                    );
                  }
                })()}
              </div>
            </>
          );
        } else {
          return null;
        }
      })()}
    </div>
  );
};

export default TimelineMember;

export interface TimelineMemberDialogProps extends TimelineMemberProps {
  open: boolean;
  onClose: () => void;
}

const useDialogStyles = makeStyles((theme: Theme) => ({
  dialog: (props: { loading: boolean }) => ({
    minWidth: 500,
    minHeight: 200,
    [theme.breakpoints.down('sm')]: {
      minWidth: 250
    },
    display: 'flex',
    ...(props.loading
      ? {
          justifyContent: 'center',
          alignItems: 'center'
        }
      : {})
  })
}));

export const TimelineMemberDialog: React.FC<TimelineMemberDialogProps> = props => {
  const classes = useDialogStyles({ loading: props.members == null });

  return (
    <Dialog
      classes={{ paper: classes.dialog }}
      open={props.open}
      onClose={props.onClose}
    >
      <TimelineMember {...props} />
    </Dialog>
  );
};
