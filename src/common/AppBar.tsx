import React from 'react';
import { useHistory, matchPath } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, NavbarToggler, Collapse, Nav, NavItem } from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

import { useUser } from '../data/user';
import { useOptionalVersionedAvatarUrl } from '../user/api';

import TimelineLogo from './TimelineLogo';

const AppBar: React.FC<{}> = (_) => {
  const history = useHistory();
  const user = useUser();
  const avatarUrl = useOptionalVersionedAvatarUrl(user?._links?.avatar);

  const { t } = useTranslation();

  const isUpMd = useMediaQuery({
    minWidth: getComputedStyle(document.documentElement).getPropertyValue(
      '--breakpoint-md'
    ),
  });

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = React.useCallback((): void => {
    setIsMenuOpen((oldIsMenuOpen) => !oldIsMenuOpen);
  }, []);

  const isAdministrator = user && user.administrator;

  const rightArea = (
    <div className="ml-auto mr-2">
      {user != null ? (
        <NavLink to={`/users/${user.username}`}>
          <img
            className="avatar small rounded-circle bg-white"
            src={avatarUrl}
          />
        </NavLink>
      ) : (
        <NavLink className="text-light" to="/login">
          {t('nav.login')}
        </NavLink>
      )}
    </div>
  );

  return (
    <Navbar dark className="fixed-top w-100 bg-primary app-bar" expand="md">
      <Link to="/" className="navbar-brand d-flex align-items-center">
        <TimelineLogo style={{ height: '1em' }} />
        Timeline
      </Link>

      {isUpMd ? null : rightArea}

      <NavbarToggler onClick={toggleMenu} />
      <Collapse isOpen={isMenuOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem
            className={
              matchPath(history.location.pathname, '/settings')
                ? 'active'
                : undefined
            }
          >
            <NavLink className="nav-link" to="/settings">
              {t('nav.settings')}
            </NavLink>
          </NavItem>

          <NavItem
            className={
              matchPath(history.location.pathname, '/about')
                ? 'active'
                : undefined
            }
          >
            <NavLink className="nav-link" to="/about">
              {t('nav.about')}
            </NavLink>
          </NavItem>

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
        {isUpMd ? rightArea : null}
      </Collapse>
    </Navbar>
  );
};

export default AppBar;
