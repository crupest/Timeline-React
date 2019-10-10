import React from "react";
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
  Button
} from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles";
import axios from "axios";

import { User, UserWithToken } from "../data/user";
import { apiBaseUrl } from "../config";

async function fetchUserList(token: string): Promise<User[]> {
  const res = await axios.get(`${apiBaseUrl}/users?token=${token}`);
  return res.data;
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

const addUserDialogStyles = createStyles({
  title: {
    color: "green"
  }
});

interface AddUserDialogProps extends WithStyles<typeof addUserDialogStyles> {
  open: boolean;
  onClose: () => void;
}

const AddUserDialog = withStyles(addUserDialogStyles)(
  (props: AddUserDialogProps) => {
    const classes = props.classes;
    return (
      <Dialog open={props.open} onClose={props.onClose} disableBackdropClick>
        <DialogTitle classes={{ root: classes.title }}>Create!</DialogTitle>
        <DialogContent>You are creating a new user.</DialogContent>
        <DialogActions>
          <Button variant="text" onClick={props.onClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    );
  }
);

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
          <AddUserDialog
            open={this.state.openAddDialog}
            onClose={this.onAddDialogClose}
          />
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
