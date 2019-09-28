import React, { ComponentProps } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
  withRouter,
  RouteComponentProps,
  RouteProps
} from "react-router-dom";
import { Subscription } from "rxjs";
import { hot } from "react-hot-loader/root";

import { AppBar, Button, createMuiTheme, withStyles } from "@material-ui/core";

import logo from "./logo.svg";
import "./App.css";

import { User, UserService } from "./user/user-service";

import Login from "./user/Login";
import Loading from "./common/Loading";
import NavUser from "./NavUser";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";

const Home: React.FC = () => {
  return <div> Home Page!</div>;
};

const NoMatch: React.FC = () => {
  return <div>Ah-oh, 404!</div>;
};

interface AppState {
  user: User | null | undefined;
}

interface LinkButtonProps extends RouteComponentProps {
  to?: string;
  children?: React.ReactNode;
}

const LinkButtonInternalButton = withStyles({
  label: {
    color: "white"
  }
})(Button);

const LinkButton = withRouter((props: LinkButtonProps) => {
  return (
    <LinkButtonInternalButton
      onClick={
        props.to
          ? () => {
              props.history.push(props.to!);
            }
          : undefined
      }
    >
      {props.children}
    </LinkButtonInternalButton>
  );
});

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: "unset"
    }
  }
});

class App extends React.Component<{}, AppState> {
  private userSubscription!: Subscription;

  constructor(props: {}) {
    super(props);
    this.state = {
      user: undefined
    };

    UserService.getInstance().checkSavedLoginState();
  }

  public componentDidMount() {
    this.userSubscription = UserService.getInstance().user$.subscribe(u =>
      this.setState({ user: u })
    );
  }

  public componentWillUnmount() {
    this.userSubscription.unsubscribe();
  }

  public render(): React.ReactNode {
    let userArea: React.ReactNode;
    const user = this.state.user;
    if (user === undefined) {
      userArea = <Loading size={50} />;
    } else {
      userArea = <NavUser user={user} />;
    }

    return (
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Router>
            <AppBar>
              <div className="app-bar-body">
                <LinkButton to="/">
                  <img className="nav-logo" src={logo} alt="logo" />
                  Timeline
                </LinkButton>
                <span className="fill-remaining-space"></span>
                {userArea}
              </div>
            </AppBar>
            <div style={{ height: 56 }}></div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </ThemeProvider>
      </StylesProvider>
    );
  }
}

export default hot(App);
