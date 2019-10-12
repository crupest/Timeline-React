import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Card,
  IconButton,
  Icon,
  Menu,
  MenuItem,
  Fab,
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import OperationDialog, { OperationStep } from "../common/OperationDialog";

import { User, UserWithToken } from "../data/user";
import { apiBaseUrl } from "../config";

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
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Network Error!"));
    }, 2000);
  });
}

function deleteUser(username: string, token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function changeUsername(
  username: string,
  newUsername: string,
  token: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function changePassword(
  username: string,
  newPassword: string,
  token: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function changePermission(
  username: string,
  newPermission: boolean,
  token: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

const useCardStyles = makeStyles({
  card: {
    margin: "10px",
    padding: "10px",
    display: "flex"
  },
  cardContent: {
    flexGrow: 1
  },
  cardActions: {}
});

const kChangeUsername = "changeusername";
const kChangePassword = "changepassword";
const kChangePermission = "changepermission";

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

  const user = props.user;

  return (
    <Card key={user.username} classes={{ root: classes.card }}>
      <div className={classes.cardContent}>
        <Typography variant="body1">{user.username}</Typography>
        <Typography
          variant="caption"
          color={user.administrator ? "error" : "textPrimary"}
        >
          {user.administrator ? "administrator" : "user"}
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
          <MenuItem onClick={() => props.onContextMenu(kChangeUsername)}>
            Change username
          </MenuItem>
          <MenuItem onClick={() => props.onContextMenu(kChangePassword)}>
            Change password
          </MenuItem>
          <MenuItem onClick={() => props.onContextMenu(kChangePermission)}>
            Change permission
          </MenuItem>
        </Menu>
      </div>
    </Card>
  );
};

const UsernameLabel: React.FC = props => {
  return <span style={{ color: "blue" }}>{props.children}</span>;
};

interface CreateUserDialogProps {
  open: boolean;
  close: () => void;
  process: (user: CreateUserInfo) => Promise<void>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = props => {
  const [step, setStep] = useState<OperationStep>("input");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [administrator, setAdministrator] = useState<boolean>(false);

  return (
    <OperationDialog
      title="Create"
      titleColor="create"
      step={step}
      inputPrompt="You are creating a new user."
      input={
        <>
          <TextField
            label="username"
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            label="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <FormControlLabel
            value={administrator}
            onChange={e => {
              setAdministrator((e.target as HTMLInputElement).checked);
            }}
            control={<Checkbox />}
            label="administrator"
          />
        </>
      }
      onConfirm={() => {
        setStep("process");
        props
          .process({
            username,
            password,
            administrator
          })
          .then(
            _ => {
              setStep({
                error: false,
                content: "Ok!"
              });
            },
            e => {
              setStep({
                error: true,
                content: e.toString()
              });
            }
          );
      }}
      close={props.close}
      open={props.open}
    />
  );
};

interface UserDeleteDialogProps {
  open: boolean;
  username: string;
  close: () => void;
  process: () => Promise<void>;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = props => {
  const [step, setStep] = useState<OperationStep>("input");

  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      step={step}
      title="Dangerous"
      titleColor="dangerous"
      inputPrompt={
        <>
          {"You are deleting user "}
          <UsernameLabel>{props.username}</UsernameLabel>
          {" !"}
        </>
      }
      onConfirm={() => {
        setStep("process");
        props.process().then(
          _ => {
            setStep({
              error: false,
              content: "Ok!"
            });
          },
          e => {
            setStep({
              error: true,
              content: e.toString()
            });
          }
        );
      }}
    />
  );
};

interface UserModifyDialogProps<T> {
  open: boolean;
  username: string;
  close: () => void;
  process: (value: T) => Promise<void>;
}

const UserChangeUsernameDialog: React.FC<
  UserModifyDialogProps<string>
> = props => {
  const [step, setStep] = useState<OperationStep>("input");
  const [newUsername, setNewUsername] = useState<string>("");

  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      step={step}
      title="Caution"
      titleColor="dangerous"
      input={
        <TextField
          label="New Username"
          value={newUsername}
          onChange={e => setNewUsername(e.target.value)}
        />
      }
      inputPrompt={
        <>
          {"You are change the username of user "}
          <UsernameLabel>{props.username}</UsernameLabel>
          {" !"}
        </>
      }
      onConfirm={() => {
        setStep("process");
        props.process(newUsername).then(
          _ => {
            setStep({
              error: false,
              content: "Ok!"
            });
          },
          e => {
            setStep({
              error: true,
              content: e.toString()
            });
          }
        );
      }}
    />
  );
};

const UserChangePasswordDialog: React.FC<
  UserModifyDialogProps<string>
> = props => {
  const [step, setStep] = useState<OperationStep>("input");
  const [newPassword, setNewPassword] = useState<string>("");

  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      step={step}
      title="Caution"
      titleColor="dangerous"
      input={
        <TextField
          label="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
      }
      inputPrompt={
        <>
          {"You are change the password of user "}
          <UsernameLabel>{props.username}</UsernameLabel>
          {" !"}
        </>
      }
      onConfirm={() => {
        setStep("process");
        props.process(newPassword).then(
          _ => {
            setStep({
              error: false,
              content: "Ok!"
            });
          },
          e => {
            setStep({
              error: true,
              content: e.toString()
            });
          }
        );
      }}
    />
  );
};

interface UserChangePermissionDialogProps {
  open: boolean;
  username: string;
  newPermission: boolean;
  close: () => void;
  process: () => Promise<void>;
}

const UserChangePermissionDialog: React.FC<
  UserChangePermissionDialogProps
> = props => {
  const [step, setStep] = useState<OperationStep>("input");

  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      step={step}
      title="Caution"
      titleColor="dangerous"
      inputPrompt={
        <>
          {"You are change user "}
          <UsernameLabel>{props.username}</UsernameLabel>
          {" to "}
          <span style={{ color: "orange" }}>
            {props.newPermission ? "administrator" : "normal user"}
          </span>
          {" !"}
        </>
      }
      onConfirm={() => {
        setStep("process");
        props.process().then(
          _ => {
            setStep({
              error: false,
              content: "Ok!"
            });
          },
          e => {
            setStep({
              error: true,
              content: e.toString()
            });
          }
        );
      }}
    />
  );
};

const useStyles = makeStyles({
  loadingArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
  },
  progressBar: {
    margin: "0 10px"
  },
  fab: {
    position: "fixed",
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
        type: "create";
      }
    | { type: "delete"; username: string }
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
      case "create":
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
      case "delete":
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
      case kChangePermission:
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

  if (users) {
    const userComponents = users.map(user => {
      return (
        <UserCard
          key={user.username}
          user={user}
          onDelete={() =>
            setDialog({
              type: "delete",
              username: user.username
            })
          }
          onContextMenu={item => {
            let dialogInfo: any = {
              type: item,
              username: user.username
            };
            if (item === "changepermission") {
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
              type: "create"
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
