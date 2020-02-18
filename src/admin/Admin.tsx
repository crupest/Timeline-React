import React, { Fragment } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useHistory
} from 'react-router';
import classnames from 'classnames';

import AppBar from '../common/AppBar';
import UserAdmin from './UserAdmin';

import { UserWithToken } from '../data/user';

interface AdminProps {
  user: UserWithToken;
}

const Admin: React.FC<AdminProps> = props => {
  const match = useRouteMatch();
  const history = useHistory();
  type TabNames = 'users' | 'more';

  const tabName = history.location.pathname.replace(match.path + '/', '');

  function toggle(newTab: TabNames): void {
    history.push(`${match.url}/${newTab}`);
  }

  const createRoute = (
    name: string,
    body: React.ReactNode
  ): React.ReactNode => {
    return (
      <Route path={`${match.path}/${name}`}>
        <AppBar />
        <div style={{ height: 56 }} className="flex-fix-length" />
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: tabName === 'users' })}
              onClick={() => {
                toggle('users');
              }}
            >
              Users
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: tabName === 'more' })}
              onClick={() => {
                toggle('more');
              }}
            >
              More
            </NavLink>
          </NavItem>
        </Nav>
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
