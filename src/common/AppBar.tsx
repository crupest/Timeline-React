import React, { Fragment } from "react";
import {
  Popover,
  Typography,
  Icon,
  IconButton,
  Button,
  withStyles,
  AppBar as MDAppBar
} from "@material-ui/core";
import { History } from "history";
import { withRouter, RouteComponentProps } from "react-router";

import logo from "./logo.svg";
import "./AppBar.css";

import {
  UserService,
  UserWithToken,
  generateAvartarUrl
} from "../services/user";
import { PageProps } from "../PageProps";

interface UserAreaProps {
  user: UserWithToken | null;
  history: History;
}

interface UserAreaState {
  anchorEl: Element | null;
}

class UserArea extends React.Component<UserAreaProps, UserAreaState> {
  constructor(props: UserAreaProps) {
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
      const avatarUrl = generateAvartarUrl(user.username, user.token);
      popupContent = (
        <Fragment>
          <img className="nav-user-avatar" src={avatarUrl} />
          <Typography variant="body1">Welcome, {user.username} !</Typography>
          <Button onClick={this.onLogout}>
            <Typography color="error" variant="button">
              Logout
            </Typography>
          </Button>
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

interface LinkButtonProps extends RouteComponentProps {
  to?: string;
  children?: React.ReactNode;
}

const LinkButtonInternalButton = withStyles({
  root: {
    margin: "0 10px"
  },
  label: {
    color: "white"
  }
})(Button);

const LinkButton = withRouter((props: LinkButtonProps) => {
  const to = props.to;
  return (
    <LinkButtonInternalButton
      onClick={
        to
          ? () => {
              props.history.push(to);
            }
          : undefined
      }
    >
      {props.children}
    </LinkButtonInternalButton>
  );
});

interface MyAppBarProps extends RouteComponentProps {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  user: UserWithToken | null | undefined;
}

class MyAppBar extends React.Component<MyAppBarProps> {
  render(): React.ReactNode {
    const user = this.props.user;
    return (
      <MDAppBar>
        <div className="app-bar-body">
          <LinkButton to="/">
            <img className="nav-logo" src={logo} alt="logo" />
            Timeline
          </LinkButton>
          {user && user.administrator && (
            <LinkButton to="/admin">Admin</LinkButton>
          )}
          <span className="fill-remaining-space"></span>
          {this.props.actions}
          {user !== undefined && (
            <UserArea history={this.props.history} user={user} />
          )}
        </div>
        {this.props.children}
      </MDAppBar>
    );
  }
}

export const AppBar = withRouter(MyAppBar);

export function withDefaultAppBar(
  C: React.ComponentType<{}>
): React.FC<PageProps> {
  return (props: PageProps) => {
    return (
      <Fragment>
        <AppBar user={props.user} />
        <C />
      </Fragment>
    );
  };
}
