import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Subscription } from "rxjs";
import { hot } from "react-hot-loader/root";
import { createMuiTheme, CircularProgress } from "@material-ui/core";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";

import "./App.css";

import { UserService, UserWithToken } from "./services/user";

import Login from "./user/Login";
import Admin from "./admin/Admin";
import { withDefaultAppBar, AppBar } from "./common/AppBar";

const Home = withDefaultAppBar(() => {
  return <div> Home Page!</div>;
});

const NoMatch = withDefaultAppBar(() => {
  return <div>Ah-oh, 404!</div>;
});

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: "unset"
    }
  }
});

interface AppState {
  user: UserWithToken | null | undefined;
}

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
    const user = this.state.user;

    let body;
    if (user === undefined) {
      body = (
        <div>
          <AppBar user={undefined} />
          <CircularProgress />
        </div>
      );
    } else {
      body = (
        <>
          <div style={{ height: 56 }}></div>
          <Switch>
            <Route exact path="/">
              <Home user={user} />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/admin">
              <Admin user={user} />
            </Route>
            <Route>
              <NoMatch user={user} />
            </Route>
          </Switch>
        </>
      );
    }

    return (
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Router>{body}</Router>
        </ThemeProvider>
      </StylesProvider>
    );
  }
}

export default hot(App);
