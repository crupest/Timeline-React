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
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles";
import axios from "axios";

import OperationDialog, { OperationStep } from "../common/OperationDialog";

import { User, UserWithToken } from "../data/user";
import { apiBaseUrl } from "../config";

async function fetchUserList(token: string): Promise<User[]> {
  const res = await axios.get(`${apiBaseUrl}/users?token=${token}`);
  return res.data;
}

function createUser(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Network Error!"));
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

interface AddUserDialogProps {
  open: boolean;
  close: () => void;
  onCreated: (user: User) => void;
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
        createUser().then(
          () => {
            setStep({
              error: false,
              content: "Ok!"
            });
            props.onCreated({
              username,
              administrator
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
            <AddUserDialog
              open
              close={this.onAddDialogClose}
              onCreated={user => {
                this.setState(state => ({
                  users: [...state.users!, user]
                }));
              }}
            />
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
