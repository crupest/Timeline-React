import React, { useState } from 'react';
import { makeStyles, Typography, Link, Theme, Icon } from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router';

import AppBar from '../common/AppBar';
import SearchInput from '../common/SearchInput';

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
  }
}));

const Home: React.FC = _ => {
  const { t } = useTranslation();

  const classes = useStyles();
  const history = useHistory();

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
      </div>
    </>
  );
};

export default Home;
