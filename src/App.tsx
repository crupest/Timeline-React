import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { createMuiTheme, CircularProgress } from '@material-ui/core';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { teal, orange } from '@material-ui/core/colors';

import AppBar from './common/AppBar';
import Login from './user/Login';
import Home from './home/Home';
import Settings from './settings/Settings';
import User from './user/User';

import { useUser } from './data/user';

const LoadingPage: React.FC = () => {
  return <CircularProgress />;
};

const NoMatch: React.FC = () => {
  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <div>Ah-oh, 404!</div>
    </>
  );
};

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: orange
  },
  typography: {
    fontFamily:
      '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    button: {
      textTransform: 'unset'
    }
  }
});

const LazyAdmin = React.lazy(() =>
  import(/* webpackChunkName: "admin" */ './admin/Admin')
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
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/users/:username">
            <User />
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
