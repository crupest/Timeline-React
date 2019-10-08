import React from "react";

import { withStyles, createStyles } from "@material-ui/styles";

import { User, UserWithToken } from "../services/user";
import { CircularProgress, Typography, } from "@material-ui/core";
import { WithStyles } from "@material-ui/core/styles";

const styles = createStyles({
  loadingArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    flexGrow: 1,
  },
  progressBar: {
    margin: '0 10px',
  }
});

interface UserAdminProps extends WithStyles<typeof styles> {
  user: UserWithToken;
}

interface UserAdminState {
  users: User[] | undefined;
}

class UserAdmin extends React.Component<UserAdminProps, UserAdminState> {
  state = {
    users: undefined
  };

  constructor(props: UserAdminProps) {
    super(props);
  }

  render(): React.ReactNode {
    const classes = this.props.classes;
    return (
      <div className={classes.loadingArea}>
        <CircularProgress className={classes.progressBar} />
        <Typography variant="body1">Loading user list...</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(UserAdmin);
