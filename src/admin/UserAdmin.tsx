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

function createUser(
  user: {
    username: string;
    password: string;
    administrator: boolean;
  },
  token: string
): Promise<void> {
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

interface UserCardProps {
  onDelete: () => void;
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
          <MenuItem>Change username</MenuItem>
          <MenuItem>Change password</MenuItem>
          <MenuItem>Change permission</MenuItem>
        </Menu>
      </div>
    </Card>
  );
};

interface AddUserDialogProps {
  open: boolean;
  close: () => void;
  process: (user: {
    username: string;
    password: string;
    administrator: boolean;
  }) => Promise<void>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = props => {
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
      inputPrompt={"You are deleting user " + props.username + " !"}
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
  const classes = useStyles();
  const [users, setUsers] = useState<User[] | null>(null);
  const [dialog, setDialog] = useState<
    | null
    | {
        type: "create";
      }
    | { type: "delete"; username: string }
  >(null);

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
          <AddUserDialog
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
