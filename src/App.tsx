import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Subscription } from "rxjs";
import { hot } from "react-hot-loader/root";
import { createMuiTheme, CircularProgress } from "@material-ui/core";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";

import "./App.css";

import Login from "./user/Login";
import { AppBar } from "./common/AppBar";

import { withUser, UserComponentProps } from "./data/user";

const Home: React.FC = () => {
  return (
    <>
      <AppBar />
      <div> Home Page!</div>
    </>
  );
};

const NoMatch: React.FC = () => {
  return (
    <>
      <AppBar />
      <div>Ah-oh, 404!</div>
    </>
  );
};

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: "unset"
    }
  }
});

const LazyAdmin = React.lazy(() =>
  import(/* webpackChunkName: "admin" */ "./admin/Admin")
);

class App extends React.Component<UserComponentProps> {
  private userSubscription!: Subscription;

  constructor(props: UserComponentProps) {
    super(props);
  }

  public render(): React.ReactNode {
    const user = this.props.user;
    let body;
    if (user === undefined) {
      body = (
        <Fragment>
          <AppBar />
          <CircularProgress />
        </Fragment>
      );
    } else {
      body = (
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          {user && user.administrator && (
            <Route path="/admin">
              <React.Suspense fallback={<CircularProgress />}>
                <LazyAdmin user={user} />
              </React.Suspense>
            </Route>
          )}
          <Route>
            <NoMatch />
          </Route>
        </Switch>
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

export default hot(withUser(App));
