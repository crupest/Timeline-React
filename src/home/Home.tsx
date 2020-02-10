import React, { useState } from 'react';
import { makeStyles, Theme, Icon } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import axios from 'axios';

import AppBar from '../common/AppBar';
import SearchInput from '../common/SearchInput';
import { useUser } from '../data/user';
import TimelineBoardAreaWithoutUser from './TimelineBoardAreaWithoutUser';
import { apiBaseUrl } from '../config';
import { TimelineInfo } from '../data/timeline';
import TimelineBoardAreaWithUser from './TimelineBoardAreaWithUser';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: '56px',
    display: 'flex',
    flexDirection: 'column'
  },
  searchBox: {
    width: '100%',
    padding: `${theme.spacing(1)}px`,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center'
  },
  search: {
    width: '100%',
    maxWidth: '500px'
  },
  boardBox: {
    width: '100%',
    minHeight: '300px',
    padding: `${theme.spacing(1)}px`,
    boxSizing: 'border-box',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      width: '50%'
    }
  },
  board: {
    width: '100%'
  }
}));

const Home: React.FC = _ => {
  const classes = useStyles();
  const history = useHistory();

  const user = useUser();

  const [navText, setNavText] = useState<string>('');

  const goto = (): void => {
    if (navText === '') {
      history.push('users/crupest');
    } else if (navText.startsWith('@')) {
      history.push(`users/${navText.slice(1)}`);
    } else {
      history.push(`timelines/${navText}`);
    }
  };

  return (
    <>
      <AppBar />
      <div className={classes.container}>
        <div className={classes.searchBox}>
          <SearchInput
            className={classes.search}
            value={navText}
            onChange={v => {
              setNavText(v);
            }}
            onButtonClick={goto}
            buttonIcon={<Icon>arrow_forward</Icon>}
            inputProps={{
              autoFocus: true,
              placeholder: '@crupest'
            }}
          />
        </div>
        {(() => {
          if (user == null) {
            return (
              <TimelineBoardAreaWithoutUser
                fetch={() =>
                  axios
                    .get<TimelineInfo[]>(`${apiBaseUrl}/timelines`)
                    .then(res => res.data)
                }
              />
            );
          } else {
            return (
              <TimelineBoardAreaWithUser
                fetchOwn={() =>
                  axios
                    .get<TimelineInfo[]>(
                      `${apiBaseUrl}/timelines?relate=${user.username}&relateType=own`
                    )
                    .then(res => res.data)
                }
                fetchJoin={() =>
                  axios
                    .get<TimelineInfo[]>(
                      `${apiBaseUrl}/timelines?relate=${user.username}&relateType=join`
                    )
                    .then(res => res.data)
                }
              />
            );
          }
        })()}
      </div>
    </>
  );
};

export default Home;
