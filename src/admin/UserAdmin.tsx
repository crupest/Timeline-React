import React, { useState } from "react";
import { withStyles, createStyles } from "@material-ui/styles";
import {
  CircularProgress,
  Typography,
  Card,
  IconButton,
  Icon,
  Menu,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { WithStyles, makeStyles } from "@material-ui/core/styles";
import axios from "axios";

import { User, UserWithToken } from "../data/user";
import { apiBaseUrl } from "../config";

async function fetchUserList(token: string): Promise<User[]> {
  const res = await axios.get(`${apiBaseUrl}/users?token=${token}`);
  return res.data;
}

function createUser(user: {
  username: string;
  password: string;
  administrator: boolean;
}): Promise<void> {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

const cardStyles = createStyles({
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

interface UserCardProps extends WithStyles<typeof cardStyles> {
  user: User;
}

interface UserCardState {
  anchor: HTMLElement | null;
}

class _UserCard extends React.Component<UserCardProps, UserCardState> {
  state = {
    anchor: null
  };

  constructor(props: UserCardProps) {
    super(props);
  }

  onMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchor: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ anchor: null });
  };

  render(): React.ReactNode {
    const classes = this.props.classes;
    const user = this.props.user;

    const anchor = this.state.anchor;

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
          <IconButton>
            <Icon color="error">delete</Icon>
          </IconButton>
          <IconButton onClick={this.onMoreClick}>
            <Icon>more_vert</Icon>
          </IconButton>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={this.onMenuClose}
          >
            <MenuItem>Change username</MenuItem>
            <MenuItem>Change password</MenuItem>
            <MenuItem>Change permission</MenuItem>
          </Menu>
        </div>
      </Card>
    );
  }
}

const UserCard = withStyles(cardStyles)(_UserCard);

const useUserDialogStyles = makeStyles({
  title: {
    color: "green"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
});

interface AddUserDialogProps {
  open: boolean;
  close: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = props => {
  const classes = useUserDialogStyles();
  const [step, setStep] = useState<"input" | "process" | "finish">("input");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [administrator, setAdministrator] = useState<boolean>(false);

  let content: React.ReactNode;
  switch (step) {
    case "input":
      content = (
        <>
          <DialogContent classes={{ root: classes.content }}>
            You are creating a new user.
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
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={() => {
                setStep("process");
                createUser({
                  username: username,
                  password: password,
                  administrator: administrator
                }).then(_ => {
                  setStep("finish");
                });
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </>
      );
      break;
    case "process":
      content = (
        <DialogContent classes={{ root: classes.content }}>
          <div>
            <CircularProgress style={{ verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle" }}> Processing!</span>
          </div>
        </DialogContent>
      );
      break;
    case "finish":
      content = (
        <DialogContent classes={{ root: classes.content }}>Ok!</DialogContent>
      );
      break;
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      disableBackdropClick={step === "process"}
      disableEscapeKeyDown={step === "process"}
    >
      <DialogTitle classes={{ root: classes.title }}>Create!</DialogTitle>
      {content}
    </Dialog>
  );
};

const styles = createStyles({
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

interface UserAdminProps extends WithStyles<typeof styles> {
  user: UserWithToken;
}

interface UserAdminState {
  users: User[] | undefined;
  openAddDialog: boolean;
}

class UserAdmin extends React.Component<UserAdminProps, UserAdminState> {
  state: UserAdminState = {
    users: undefined,
    openAddDialog: false
  };

  constructor(props: UserAdminProps) {
    super(props);
  }

  onAddButtonClick = () => {
    this.setState({
      openAddDialog: true
    });
  };

  onAddDialogClose = () => {
    this.setState({
      openAddDialog: false
    });
  };

  componentDidMount() {
    fetchUserList(this.props.user.token).then(users => {
      this.setState({
        users
      });
    });
  }

  render(): React.ReactNode {
    const classes = this.props.classes;
    const users = this.state.users;
    if (users) {
      const userComponents = users.map(user => {
        return <UserCard key={user.username} user={user} />;
      });

      return (
        <div>
          {userComponents}
          <Fab
            color="primary"
            classes={{
              root: classes.fab
            }}
            onClick={this.onAddButtonClick}
          >
            <Icon>add</Icon>
          </Fab>
          {this.state.openAddDialog && (
            <AddUserDialog open close={this.onAddDialogClose} />
          )}
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
  }
}

export default withStyles(styles)(UserAdmin);
