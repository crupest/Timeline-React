import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, Typography, Link, Theme, Icon } from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router';
import axios from 'axios';

import AppBar from '../common/AppBar';
import SearchInput from '../common/SearchInput';
import { useUser } from '../data/user';
import TimelineBoard from './TimelineBoard';
import TimelineBoardAreaWithoutUser from './TimelineBoardAreaWithoutUser';
import { apiBaseUrl } from '../config';
import { TimelineInfo } from '../data/timeline';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: '56px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  searchBox: {
    width: '100%',
    padding: `${theme.spacing(1)}px`,
    display: 'flex',
    justifyContent: 'center'
  },
  search: {
    width: '100%',
    maxWidth: '500px'
  },
  boardBox: {
    width: '100%',
    height: '300px',
    padding: `${theme.spacing(1)}px`,
    boxSizing: 'border-box',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      height: '400px'
    }
  },
  boardBoxFullWidth: {
    width: '100%'
  },
  board: {
    width: '100%'
  }
}));

const Home: React.FC = _ => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

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
              <div
                className={clsx(classes.boardBox, classes.boardBoxFullWidth)}
              >
                <TimelineBoardAreaWithoutUser
                  className={classes.board}
                  fetch={() =>
                    axios
                      .get<TimelineInfo[]>(`${apiBaseUrl}/timelines`)
                      .then(res => {
                        const data = res.data;
                        data.forEach(t => {
                          if (t.name == null) {
                            t.name = '@' + t.owner.username;
                          }
                        });
                        return data;
                      })
                  }
                />
              </div>
            );
          } else {
            return (
              <>
                <div className={classes.boardBox}>
                  <TimelineBoard className={classes.board} title="aaaaa" />
                </div>
                <div className={classes.boardBox}>
                  <TimelineBoard className={classes.board} title="aaaaa" />
                </div>
              </>
            );
          }
        })()}
      </div>
    </>
  );
};

export default Home;
