import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Typography,
  Card,
  IconButton,
  Icon,
  Menu,
  MenuItem,
  Fab
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import OperationDialog from '../common/OperationDialog';

import { User, UserWithToken } from '../data/user';
import { apiBaseUrl } from '../config';

async function fetchUserList(token: string): Promise<User[]> {
  const res = await axios.get(`${apiBaseUrl}/users?token=${token}`);
  return res.data;
}

interface CreateUserInfo {
  username: string;
  password: string;
  administrator: boolean;
}

function createUser(user: CreateUserInfo, token: string): Promise<void> {
  return axios.put(`${apiBaseUrl}/users/${user.username}?token=${token}`, {
    password: user.password,
    administrator: user.administrator
  });
}

function deleteUser(username: string, token: string): Promise<void> {
  return axios.delete(`${apiBaseUrl}/users/${username}?token=${token}`);
}

function changeUsername(
  oldUsername: string,
  newUsername: string,
  token: string
): Promise<void> {
  return axios.post(`${apiBaseUrl}/userop/changeusername?token=${token}`, {
    oldUsername,
    newUsername
  });
}

function changePassword(
  username: string,
  newPassword: string,
  token: string
): Promise<void> {
  return axios.patch(`${apiBaseUrl}/users/${username}?token=${token}`, {
    password: newPassword
  });
}

function changePermission(
  username: string,
  newPermission: boolean,
  token: string
): Promise<void> {
  return axios.patch(`${apiBaseUrl}/users/${username}?token=${token}`, {
    administrator: newPermission
  });
}

const useCardStyles = makeStyles({
  card: {
    margin: '10px',
    padding: '10px',
    display: 'flex'
  },
  cardContent: {
    flexGrow: 1
  },
  cardActions: {}
});

const kChangeUsername = 'changeusername';
const kChangePassword = 'changepassword';
const kChangePermission = 'changepermission';

type TChangeUsername = typeof kChangeUsername;
type TChangePassword = typeof kChangePassword;
type TChangePermission = typeof kChangePermission;

type ContextMenuItem = TChangeUsername | TChangePassword | TChangePermission;

interface UserCardProps {
  onDelete: () => void;
  onContextMenu: (item: ContextMenuItem) => void;
  user: User;
}

const UserCard: React.FC<UserCardProps> = props => {
  const classes = useCardStyles();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const closeMenu = (): void => setMenuAnchor(null);

  const user = props.user;

  return (
    <Card key={user.username} classes={{ root: classes.card }}>
      <div className={classes.cardContent}>
        <Typography variant="body1">{user.username}</Typography>
        <Typography
          variant="caption"
          color={user.administrator ? 'error' : 'textPrimary'}
        >
          {user.administrator ? 'administrator' : 'user'}
        </Typography>
      </div>
      <div className={classes.cardActions}>
        <IconButton onClick={props.onDelete}>
          <Icon color="error">delete</Icon>
        </IconButton>
        <IconButton
          onClick={event => {
            setMenuAnchor(event.currentTarget);
          }}
        >
          <Icon>more_vert</Icon>
        </IconButton>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              closeMenu();
              props.onContextMenu(kChangeUsername);
            }}
          >
            Change username
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              props.onContextMenu(kChangePassword);
            }}
          >
            Change password
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              props.onContextMenu(kChangePermission);
            }}
          >
            Change permission
          </MenuItem>
        </Menu>
      </div>
    </Card>
  );
};

interface DialogProps {
  open: boolean;
  close: () => void;
}

interface CreateUserDialogProps extends DialogProps {
  process: (user: CreateUserInfo) => Promise<void>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = props => {
  return (
    <OperationDialog
      title="Create"
      titleColor="create"
      inputPrompt="You are creating a new user."
      inputScheme={[
        { type: 'text', label: 'Username' },
        { type: 'text', label: 'Password' },
        { type: 'bool', label: 'Administrator' }
      ]}
      onProcess={([username, password, administrator]) =>
        props.process({
          username: username as string,
          password: password as string,
          administrator: administrator as boolean
        })
      }
      close={props.close}
      open={props.open}
    />
  );
};

const UsernameLabel: React.FC = props => {
  return <span style={{ color: 'blue' }}>{props.children}</span>;
};

interface UserDeleteDialogProps extends DialogProps {
  username: string;
  process: () => Promise<void>;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = props => {
  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      title="Dangerous"
      titleColor="dangerous"
      inputPrompt={() => (
        <>
          {'You are deleting user '}
          <UsernameLabel>{props.username}</UsernameLabel>
          {' !'}
        </>
      )}
      onProcess={props.process}
    />
  );
};

interface UserModifyDialogProps<T> extends DialogProps {
  username: string;
  process: (value: T) => Promise<void>;
}

const UserChangeUsernameDialog: React.FC<UserModifyDialogProps<
  string
>> = props => {
  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      title="Caution"
      titleColor="dangerous"
      inputPrompt={() => (
        <>
          {'You are change the username of user '}
          <UsernameLabel>{props.username}</UsernameLabel>
          {' !'}
        </>
      )}
      inputScheme={[{ type: 'text', label: 'New Username' }]}
      onProcess={([newUsername]) => {
        return props.process(newUsername as string);
      }}
    />
  );
};

const UserChangePasswordDialog: React.FC<UserModifyDialogProps<
  string
>> = props => {
  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      title="Caution"
      titleColor="dangerous"
      inputPrompt={() => (
        <>
          {'You are change the password of user '}
          <UsernameLabel>{props.username}</UsernameLabel>
          {' !'}
        </>
      )}
      inputScheme={[{ type: 'text', label: 'New Password' }]}
      onProcess={([newPassword]) => {
        return props.process(newPassword as string);
      }}
    />
  );
};

interface UserChangePermissionDialogProps extends DialogProps {
  username: string;
  newPermission: boolean;
  process: () => Promise<void>;
}

const UserChangePermissionDialog: React.FC<UserChangePermissionDialogProps> = props => {
  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      title="Caution"
      titleColor="dangerous"
      inputPrompt={() => (
        <>
          {'You are change user '}
          <UsernameLabel>{props.username}</UsernameLabel>
          {' to '}
          <span style={{ color: 'orange' }}>
            {props.newPermission ? 'administrator' : 'normal user'}
          </span>
          {' !'}
        </>
      )}
      onProcess={props.process}
    />
  );
};

const useStyles = makeStyles({
  loadingArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  },
  progressBar: {
    margin: '0 10px'
  },
  fab: {
    position: 'fixed',
    right: 26,
    bottom: 26
  }
});

interface UserAdminProps {
  user: UserWithToken;
}

const UserAdmin: React.FC<UserAdminProps> = props => {
  type DialogInfo =
    | null
    | {
        type: 'create';
      }
    | { type: 'delete'; username: string }
    | {
        type: TChangeUsername;
        username: string;
      }
    | {
        type: TChangePassword;
        username: string;
      }
    | {
        type: TChangePermission;
        username: string;
        newPermission: boolean;
      };

  const classes = useStyles();
  const [users, setUsers] = useState<User[] | null>(null);
  const [dialog, setDialog] = useState<DialogInfo>(null);

  const token = props.user.token;

  useEffect(() => {
    let subscribe = true;
    fetchUserList(props.user.token).then(us => {
      if (subscribe) {
        setUsers(us);
      }
    });
    return () => {
      subscribe = false;
    };
  }, []);

  let dialogNode: React.ReactNode;
  if (dialog)
    switch (dialog.type) {
      case 'create':
        dialogNode = (
          <CreateUserDialog
            open
            close={() => setDialog(null)}
            process={async user => {
              await createUser(user, token);
              setUsers(oldUsers => [...oldUsers!, user]);
            }}
          />
        );
        break;
      case 'delete':
        dialogNode = (
          <UserDeleteDialog
            open
            close={() => setDialog(null)}
            username={dialog.username}
            process={async () => {
              await deleteUser(dialog.username, token);
              setUsers(oldUsers =>
                oldUsers!.filter(u => u.username !== dialog.username)
              );
            }}
          />
        );
        break;
      case kChangeUsername:
        dialogNode = (
          <UserChangeUsernameDialog
            open
            close={() => setDialog(null)}
            username={dialog.username}
            process={async newUsername => {
              await changeUsername(dialog.username, newUsername, token);
              setUsers(oldUsers => {
                const users = oldUsers!.slice();
                users.find(
                  u => u.username === dialog.username
                )!.username = newUsername;
                return users;
              });
            }}
          />
        );
        break;
      case kChangePassword:
        dialogNode = (
          <UserChangePasswordDialog
            open
            close={() => setDialog(null)}
            username={dialog.username}
            process={async newPassword => {
              await changePassword(dialog.username, newPassword, token);
            }}
          />
        );
        break;
      case kChangePermission: {
        const newPermission = dialog.newPermission;
        dialogNode = (
          <UserChangePermissionDialog
            open
            close={() => setDialog(null)}
            username={dialog.username}
            newPermission={newPermission}
            process={async () => {
              await changePermission(dialog.username, newPermission, token);
              setUsers(oldUsers => {
                const users = oldUsers!.slice();
                users.find(
                  u => u.username === dialog.username
                )!.administrator = newPermission;
                return users;
              });
            }}
          />
        );
        break;
      }
    }

  if (users) {
    const userComponents = users.map(user => {
      return (
        <UserCard
          key={user.username}
          user={user}
          onDelete={() =>
            setDialog({
              type: 'delete',
              username: user.username
            })
          }
          onContextMenu={item => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dialogInfo: any = {
              type: item,
              username: user.username
            };
            if (item === 'changepermission') {
              dialogInfo.newPermission = !user.administrator;
            }
            setDialog(dialogInfo);
          }}
        />
      );
    });

    return (
      <div>
        {userComponents}
        <Fab
          color="primary"
          classes={{
            root: classes.fab
          }}
          onClick={() =>
            setDialog({
              type: 'create'
            })
          }
        >
          <Icon>add</Icon>
        </Fab>
        {dialogNode}
      </div>
    );
  } else {
    return (
      <div className={classes.loadingArea}>
        <CircularProgress className={classes.progressBar} />
        <Typography variant="body1">Loading user list...</Typography>
      </div>
    );
  }
};

export default UserAdmin;
