import React, { Fragment, useState } from "react";
import {
  Popover,
  Typography,
  Icon,
  IconButton,
  Button,
  AppBar as MDAppBar,
  makeStyles
} from "@material-ui/core";
import { History } from "history";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

import logo from "./logo.svg";

import {
  UserWithToken,
  generateAvartarUrl,
  userLogout,
  useUser
} from "../data/user";

const useActionIconStyles = makeStyles({
  icon: {
    color: "white"
  }
});

interface UserAreaProps {
  user: UserWithToken | null;
  login: () => void;
  logout: () => void;
}

const useUserAreaStyles = makeStyles({
  popupContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    alignItems: "center"
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "white"
  }
});

const UserArea: React.FC<UserAreaProps> = props => {
  const classes = useUserAreaStyles();
  const iconClass = useActionIconStyles().icon;
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
        <img className={classes.avatar} src={avatarUrl} />
        <Typography variant="body1">
          {t("user.welcome0")}
          {user.username}
          {t("user.welcome1")}
        </Typography>
        <Button onClick={onLogout}>
          <Typography color="error" variant="button">
            {t("user.logout")}
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
      <IconButton onClick={onIconClick}>
        <Icon className={iconClass}>account_circle</Icon>
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
          paper: classes.popupContainer
        }}
      >
        {popupContent}
      </Popover>
    </Fragment>
  );
};

interface LinkButtonProps {
  to: string;
  history: History;
  children?: React.ReactNode;
}

const useLinkButtonStyle = makeStyles({
  root: {
    margin: "0 10px"
  },
  label: {
    color: "white"
  }
});

const LinkButton: React.FC<LinkButtonProps> = props => {
  const classes = useLinkButtonStyle();
  return (
    <Button
      onClick={() => {
        props.history.push(props.to);
      }}
      classes={classes}
    >
      {props.children}
    </Button>
  );
};

interface AppBarProps {
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const useAppBarStyles = makeStyles({
  body: {
    display: "flex",
    height: "56px",
    alignItems: "center"
  },
  logo: {
    height: "30px"
  }
});

const AppBar: React.FC<AppBarProps> = props => {
  const history = useHistory();
  const user = useUser();
  const classes = useAppBarStyles();
  const iconClass = useActionIconStyles().icon;
  const { t } = useTranslation();

  function login() {
    history.push("/login");
  }

  function logout() {
    userLogout();
    history.push("/");
  }

  return (
    <MDAppBar>
      <div className={classes.body}>
        <LinkButton to="/" history={history}>
          <img className={classes.logo} src={logo} alt="logo" />
          Timeline
        </LinkButton>
        {user && user.administrator && (
          <LinkButton to="/admin" history={history}>
            {t("admin.title")}
          </LinkButton>
        )}
        <span className="fill-remaining-space"></span>
        {props.actions}
        <IconButton onClick={() => history.push("/settings")}>
          <Icon className={iconClass}>settings</Icon>
        </IconButton>
        {user !== undefined && (
          <UserArea user={user} login={login} logout={logout} />
        )}
      </div>
      {props.children}
    </MDAppBar>
  );
};

export default AppBar;
