import React from "react";
import { withStyles, createStyles } from "@material-ui/styles";
import { CircularProgress, Typography, Card } from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles";

import { User, UserWithToken } from "../data/user";

function fetchUserList(token: string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          username: "hahaha",
          administrator: true
        },
        {
          username: "xixixi",
          administrator: false
        }
      ]);
    }, 2000);
  });
}

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
  card: {
    margin: "10px",
    padding: "10px"
  }
});

interface UserAdminProps extends WithStyles<typeof styles> {
  user: UserWithToken;
}

interface UserAdminState {
  users: User[] | undefined;
}

class UserAdmin extends React.Component<UserAdminProps, UserAdminState> {
  state: UserAdminState = {
    users: undefined
  };

  constructor(props: UserAdminProps) {
    super(props);

    fetchUserList(props.user.token).then(users => {
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
        return (
          <Card key={user.username} classes={{ root: classes.card }}>
            <Typography variant="body1">{user.username}</Typography>
            <Typography variant="caption">
              {user.administrator ? "administrator" : "user"}
            </Typography>
          </Card>
        );
      });

      return <div>{userComponents}</div>;
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
