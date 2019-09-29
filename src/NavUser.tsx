import React, { Fragment } from "react";
import {
  Popover,
  Typography,
  Icon,
  IconButton,
  Button
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router";

import "./NavUser.css";

import { User, UserService } from "./services/user";

interface NavUserProps extends RouteComponentProps {
  user: User | null;
}

interface NavUserState {
  anchorEl: Element | null;
}

class NavUser extends React.Component<NavUserProps, NavUserState> {
  constructor(props: NavUserProps) {
    super(props);

    this.state = {
      anchorEl: null
    };

    this.onClick = this.onClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onClick(event: React.SyntheticEvent) {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  onClose(_: {}) {
    this.setState({
      anchorEl: null
    });
  }

  onLogin(_: React.SyntheticEvent) {
    this.props.history.push("/login");
    this.onClose({});
  }

  onLogout(_: React.MouseEvent) {
    UserService.getInstance().logout();
    this.onClose({});
  }

  render(): React.ReactNode {
    const user = this.props.user;
    let popupContent;
    if (user) {
      const avatarUrl = UserService.getInstance().generateAvartarUrl(
        user.username
      );
      popupContent = (
        <Fragment>
          <img className="nav-user-avatar" src={avatarUrl} />
          <Typography variant="body1">Welcome, {user.username} !</Typography>
          <Button onClick={this.onLogout}><Typography color="error" variant="button">Logout</Typography></Button>
        </Fragment>
      );
    } else {
      popupContent = (
        <Fragment>
          <Typography variant="body1">You haven't login.</Typography>
          <Button color="primary" onClick={this.onLogin}>
            Login
          </Button>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <IconButton onClick={this.onClick} style={{ color: "white" }}>
          <Icon>account_circle</Icon>
        </IconButton>
        <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          onClose={this.onClose}
          classes={{
            paper: "nav-user-popup-container"
          }}
        >
          {popupContent}
        </Popover>
      </Fragment>
    );
  }
}

export default withRouter(NavUser);
