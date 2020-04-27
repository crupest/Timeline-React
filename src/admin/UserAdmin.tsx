import React, { useState, useEffect } from 'react';
import {
  ListGroupItem,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Button,
} from 'reactstrap';
import axios from 'axios';

import OperationDialog from '../common/OperationDialog';

import { User, UserWithToken } from '../data/user';
import { apiBaseUrl } from '../config';

async function fetchUserList(_token: string): Promise<User[]> {
  const res = await axios.get(`${apiBaseUrl}/users`);
  return res.data;
}

interface CreateUserInfo {
  username: string;
  password: string;
  administrator: boolean;
}

async function createUser(user: CreateUserInfo, token: string): Promise<User> {
  const res = await axios.post<User>(
    `${apiBaseUrl}/userop/createuser?token=${token}`,
    user
  );
  return res.data;
}

function deleteUser(username: string, token: string): Promise<void> {
  return axios.delete(`${apiBaseUrl}/users/${username}?token=${token}`);
}

function changeUsername(
  oldUsername: string,
  newUsername: string,
  token: string
): Promise<void> {
  return axios.patch(`${apiBaseUrl}/users/${oldUsername}?token=${token}`, {
    username: newUsername,
  });
}

function changePassword(
  username: string,
  newPassword: string,
  token: string
): Promise<void> {
  return axios.patch(`${apiBaseUrl}/users/${username}?token=${token}`, {
    password: newPassword,
  });
}

function changePermission(
  username: string,
  newPermission: boolean,
  token: string
): Promise<void> {
  return axios.patch(`${apiBaseUrl}/users/${username}?token=${token}`, {
    administrator: newPermission,
  });
}

const kChangeUsername = 'changeusername';
const kChangePassword = 'changepassword';
const kChangePermission = 'changepermission';
const kDelete = 'delete';

type TChangeUsername = typeof kChangeUsername;
type TChangePassword = typeof kChangePassword;
type TChangePermission = typeof kChangePermission;
type TDelete = typeof kDelete;

type ContextMenuItem =
  | TChangeUsername
  | TChangePassword
  | TChangePermission
  | TDelete;

interface UserCardProps {
  onContextMenu: (item: ContextMenuItem) => void;
  user: User;
}

const UserItem: React.FC<UserCardProps> = (props) => {
  const user = props.user;

  const createClickCallback = (item: ContextMenuItem): (() => void) => {
    return () => {
      props.onContextMenu(item);
    };
  };

  return (
    <ListGroupItem className="container">
      <Row className="align-items-center">
        <Col>
          <p className="mb-0 text-primary">{user.username}</p>
          <small
            className={user.administrator ? 'text-danger' : 'text-secondary'}
          >
            {user.administrator ? 'administrator' : 'user'}
          </small>
        </Col>
        <Col className="col-auto">
          <UncontrolledDropdown>
            <DropdownToggle color="warning" className="text-light" caret>
              Manage
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={createClickCallback(kChangeUsername)}>
                Change Username
              </DropdownItem>
              <DropdownItem onClick={createClickCallback(kChangePassword)}>
                Change Password
              </DropdownItem>
              <DropdownItem onClick={createClickCallback(kChangePermission)}>
                Change Permission
              </DropdownItem>
              <DropdownItem
                className="text-danger"
                onClick={createClickCallback(kDelete)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

interface DialogProps {
  open: boolean;
  close: () => void;
}

interface CreateUserDialogProps extends DialogProps {
  process: (user: CreateUserInfo) => Promise<void>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = (props) => {
  return (
    <OperationDialog
      title="Create"
      titleColor="create"
      inputPrompt="You are creating a new user."
      inputScheme={[
        { type: 'text', label: 'Username' },
        { type: 'text', label: 'Password' },
        { type: 'bool', label: 'Administrator' },
      ]}
      onProcess={([username, password, administrator]) =>
        props.process({
          username: username as string,
          password: password as string,
          administrator: administrator as boolean,
        })
      }
      close={props.close}
      open={props.open}
    />
  );
};

const UsernameLabel: React.FC = (props) => {
  return <span style={{ color: 'blue' }}>{props.children}</span>;
};

interface UserDeleteDialogProps extends DialogProps {
  username: string;
  process: () => Promise<void>;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = (props) => {
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

const UserChangeUsernameDialog: React.FC<UserModifyDialogProps<string>> = (
  props
) => {
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

const UserChangePasswordDialog: React.FC<UserModifyDialogProps<string>> = (
  props
) => {
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

const UserChangePermissionDialog: React.FC<UserChangePermissionDialogProps> = (
  props
) => {
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

interface UserAdminProps {
  user: UserWithToken;
}

const UserAdmin: React.FC<UserAdminProps> = (props) => {
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

  const [users, setUsers] = useState<User[] | null>(null);
  const [dialog, setDialog] = useState<DialogInfo>(null);

  const token = props.user.token;

  useEffect(() => {
    let subscribe = true;
    fetchUserList(props.user.token).then((us) => {
      if (subscribe) {
        setUsers(us);
      }
    });
    return () => {
      subscribe = false;
    };
  }, [props.user]);

  let dialogNode: React.ReactNode;
  if (dialog)
    switch (dialog.type) {
      case 'create':
        dialogNode = (
          <CreateUserDialog
            open
            close={() => setDialog(null)}
            process={async (user) => {
              const u = await createUser(user, token);
              setUsers((oldUsers) => [...oldUsers!, u]);
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
              setUsers((oldUsers) =>
                oldUsers!.filter((u) => u.username !== dialog.username)
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
            process={async (newUsername) => {
              await changeUsername(dialog.username, newUsername, token);
              setUsers((oldUsers) => {
                const users = oldUsers!.slice();
                users.find(
                  (u) => u.username === dialog.username
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
            process={async (newPassword) => {
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
              setUsers((oldUsers) => {
                const users = oldUsers!.slice();
                users.find(
                  (u) => u.username === dialog.username
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
    const userComponents = users.map((user) => {
      return (
        <UserItem
          key={user.username}
          user={user}
          onContextMenu={(item) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dialogInfo: any = {
              type: item,
              username: user.username,
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
      <>
        <Button
          color="success"
          onClick={() =>
            setDialog({
              type: 'create',
            })
          }
          className="align-self-end"
        >
          Create User
        </Button>
        {userComponents}
        {dialogNode}
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default UserAdmin;
