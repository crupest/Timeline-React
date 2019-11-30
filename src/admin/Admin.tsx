import React, { Fragment } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useHistory
} from 'react-router';

import AppBar from '../common/AppBar';
import UserAdmin from './UserAdmin';

import { UserWithToken } from '../data/user';

interface AdminProps {
  user: UserWithToken;
}

const Admin: React.FC<AdminProps> = props => {
  const match = useRouteMatch();
  const history = useHistory();

  function onTabChange(_: React.ChangeEvent<{}>, newValue: string): void {
    history.push(`${match.url}/${newValue}`);
  }

  const createRoute = (
    name: string,
    body: React.ReactNode
  ): React.ReactNode => {
    return (
      <Route path={`${match.path}/${name}`}>
        <AppBar>
          <Tabs value={name} onChange={onTabChange}>
            <Tab label="Users" value="users" />
            <Tab label="More" value="more" />
          </Tabs>
        </AppBar>
        <div style={{ height: 104 }} />
        {body}
      </Route>
    );
  };

  return (
    <Fragment>
      <Switch>
        <Redirect from={match.path} to={`${match.path}/users`} exact />
        {createRoute('users', <UserAdmin user={props.user} />)}
        {createRoute('more', <div>More Page Works</div>)}
      </Switch>
    </Fragment>
  );
};

export default Admin;
