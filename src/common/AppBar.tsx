import React from 'react';
import { useHistory, matchPath } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, NavbarToggler, Collapse, Nav, NavItem } from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

import { useUser } from '../data/user';

import TimelineLogo from './TimelineLogo';

const AppBar: React.FC<{}> = _ => {
  const history = useHistory();
  const user = useUser();
  const { t } = useTranslation();

  const isUpMd = useMediaQuery({
    minWidth: getComputedStyle(document.documentElement).getPropertyValue(
      '--breakpoint-md'
    )
  });

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  const isAdministrator = user && user.administrator;

  const rightArea = (
    <div className="ml-auto mr-2">
      {user != null ? (
        <img className="avatar small rounded-circle" src={user._links.avatar} />
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
