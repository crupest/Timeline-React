import React, { useState } from 'react';
import { makeStyles, Typography, Link, Theme, Icon } from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router';

import AppBar from '../common/AppBar';
import SearchInput from '../common/SearchInput';

const hToColor = (h: number): string => `hsl(${h} 70% 70%)`;

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    padding: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center'
  },
  '@keyframes welcome': {
    '0%': {
      color: hToColor(0)
    },
    '16.66%': {
      color: hToColor(60)
    },
    '33.33%': {
      color: hToColor(120)
    },
    '50%': {
      color: hToColor(180)
    },
    '66.66%': {
      color: hToColor(240)
    },
    '83.33%': {
      color: hToColor(300)
    },
    '100%': {
      color: hToColor(360)
    }
  },
  welcome: {
    margin: `${theme.spacing(2)}px 0`,
    animationName: '$welcome',
    animationDuration: '10s',
    animationIterationCount: 'infinite'
  },
  navInput: {
    alignSelf: 'stretch',
    margin: `${theme.spacing(2)}px 0`,
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(2)}px`
    }
  }
}));

const Home: React.FC = _ => {
  const { t } = useTranslation();

  const classes = useStyles();
  const history = useHistory();

  const [navText, setNavText] = useState<string>('');

  const goto = (): void => {
    history.push(`users/${navText === '' ? 'crupest' : navText}`);
  };
  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <div className={classes.content}>
        <Typography variant="h4" classes={{ root: classes.welcome }}>
          {t('welcome')}
        </Typography>
        <div>
          <Trans i18nKey="home.guide">
            <Typography>0</Typography>
            <Typography>1</Typography>
          </Trans>
          <SearchInput
            className={classes.navInput}
            value={navText}
            onChange={v => {
              setNavText(v);
            }}
            onButtonClick={goto}
            buttonIcon={<Icon>arrow_forward</Icon>}
            inputProps={{
              autoFocus: true,
              placeholder: 'crupest'
            }}
          />
        </div>

        <div>
          <Trans i18nKey="home.description">
            <Typography variant="body2">
              0
              <Link href="https://github.com/crupest" target="_blank">
                1
              </Link>
              2
              <Link
                href="https://github.com/crupest/Timeline-React"
                target="_blank"
              >
                3
              </Link>
              4
              <Link href="https://github.com/crupest/Timeline" target="_blank">
                5
              </Link>
              6
            </Typography>
          </Trans>
        </div>
      </div>
    </>
  );
};

export default Home;
