import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import { createMuiTheme, CircularProgress } from "@material-ui/core";
import { ThemeProvider, StylesProvider } from "@material-ui/styles";

import "./App.css";

import Home from "./home/Home";
import Login from "./user/Login";
import { AppBar } from "./common/AppBar";

import { useUser } from "./data/user";

const LoadingPage: React.FC = () => {
  return (
    <Fragment>
      <AppBar />
      <CircularProgress />
    </Fragment>
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

const App: React.FC = _ => {
  const user = useUser();

  let body;
  if (user === undefined) {
    body = <LoadingPage />;
  } else {
    body = (
      <React.Suspense fallback={<LoadingPage />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          {user && user.administrator && (
            <Route path="/admin">
              <LazyAdmin user={user} />
            </Route>
          )}
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </React.Suspense>
    );
  }

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>{body}</Router>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default hot(App);
