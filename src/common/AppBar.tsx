import React, { Fragment, useState } from "react";
import {
  Popover,
  Typography,
  Icon,
  IconButton,
  Button,
  withStyles,
  AppBar as MDAppBar
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";

import logo from "./logo.svg";
import "./AppBar.css";
import {
  UserWithToken,
  generateAvartarUrl,
  userLogout,
  withUser,
  UserComponentProps
} from "../data/user";

interface UserAreaProps {
  user: UserWithToken | null;
  login: () => void;
  logout: () => void;
}

const UserArea: React.FC<UserAreaProps> = props => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  function onIconClick(event: React.SyntheticEvent) {
    setAnchor(event.target as HTMLElement);
  }

  function closePopup() {
    setAnchor(null);
  }

  function onLogin() {
    closePopup();
    props.login();
  }

  function onLogout() {
    closePopup();
    props.logout();
  }

  const user = props.user;
  let popupContent;
  if (user) {
    const avatarUrl = generateAvartarUrl(user.username, user.token);
    popupContent = (
      <Fragment>
        <img className="nav-user-avatar" src={avatarUrl} />
        <Typography variant="body1">Welcome, {user.username} !</Typography>
        <Button onClick={onLogout}>
          <Typography color="error" variant="button">
            Logout
          </Typography>
        </Button>
      </Fragment>
    );
  } else {
    popupContent = (
      <Fragment>
        <Typography variant="body1">{t("user.noLoginPrompt")}</Typography>
        <Button color="primary" onClick={onLogin}>
          {t("user.login")}
        </Button>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <IconButton onClick={onIconClick} style={{ color: "white" }}>
        <Icon>account_circle</Icon>
      </IconButton>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        onClose={closePopup}
        classes={{
          paper: "nav-user-popup-container"
        }}
      >
        {popupContent}
      </Popover>
    </Fragment>
  );
};

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

interface MyAppBarProps extends RouteComponentProps, UserComponentProps {
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

class MyAppBar extends React.Component<MyAppBarProps> {
  constructor(props: MyAppBarProps) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    this.props.history.push("/login");
  }

  logout() {
    userLogout();
    this.props.history.push("/");
  }

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
            <UserArea user={user} login={this.login} logout={this.logout} />
          )}
        </div>
        {this.props.children}
      </MDAppBar>
    );
  }
}

export const AppBar = withRouter(withUser(MyAppBar));
