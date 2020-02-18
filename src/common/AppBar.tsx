import React from 'react';
import { useHistory, matchPath } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Navbar,
  Button,
  Popover,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem
} from 'reactstrap';

import { UserWithToken, userLogout, useUser } from '../data/user';

import TimelineLogo from './TimelineLogo';

interface UserCardProps {
  user: UserWithToken | null | undefined;
  login: () => void;
  logout: () => void;
}

const UserCard: React.FC<UserCardProps> = props => {
  const { t } = useTranslation();

  function onLogin(): void {
    props.login();
  }

  function onLogout(): void {
    props.logout();
  }

  const user = props.user;
  if (user) {
    const avatarUrl = user._links.avatar;
    return (
      <div className="p-3">
        <img style={{ width: '100px' }} src={avatarUrl} />
        <p>{t('user.welcome', { name: user.username })}</p>
        <Button color="primary" onClick={onLogout}>
          {t('user.logout')}
        </Button>
      </div>
    );
  } else {
    return (
      <div className="p-3">
        <h6>{t('user.noLoginPrompt')}</h6>
        <Button color="primary" onClick={onLogin}>
          {t('user.login')}
        </Button>
      </div>
    );
  }
};

const AppBar: React.FC<{}> = _ => {
  const history = useHistory();
  const user = useUser();

  const [userCardOpen, setUserCardOpen] = React.useState<boolean>(false);

  const toggleUserCard = (): void => setUserCardOpen(!userCardOpen);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  function login(): void {
    history.push('/login');
  }

  function logout(): void {
    userLogout();
    history.push('/');
  }

  const isAdministrator = user && user.administrator;

  return (
    <Navbar dark className="fixed-top w-100 bg-primary app-bar" expand="md">
      <Link to="/" className="navbar-brand d-flex align-items-center">
        <TimelineLogo style={{ height: '1em' }} />
        Timeline
      </Link>

      <NavbarToggler onClick={toggleMenu} />
      <Collapse isOpen={isMenuOpen} navbar>
        <Nav className="mr-auto" navbar>
          {isAdministrator && (
            <NavItem
              className={
                matchPath(history.location.pathname, '/admin')
                  ? 'active'
                  : undefined
              }
            >
              <NavLink className="nav-link" to="/admin">
                Administration
              </NavLink>
            </NavItem>
          )}
        </Nav>
        <div className="text-right">
          <i
            className="fas fa-cog text-white mx-3"
            onClick={() => {
              history.push('/settings');
            }}
          />
          <i
            id="appbar-user-button"
            className="fas fa-user text-white mx-3"
            onClick={toggleUserCard}
          />
        </div>
      </Collapse>
      <Popover
        isOpen={userCardOpen}
        toggle={toggleUserCard}
        trigger="legacy"
        target="appbar-user-button"
        placement="bottom"
      >
        <UserCard user={user} login={login} logout={logout} />
      </Popover>
    </Navbar>
  );
};

export default AppBar;
