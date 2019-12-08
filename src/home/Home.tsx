import React, { useState } from 'react';
import {
  makeStyles,
  Typography,
  Link,
  Paper,
  InputBase,
  Theme,
  IconButton,
  Icon
} from '@material-ui/core';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router';

import AppBar from '../common/AppBar';

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
  navRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    margin: `${theme.spacing(2)}px 0`,
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(2)}px`
    }
  },
  navInput: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  navButton: {
    padding: 10
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
          <Paper component="div" className={classes.navRoot}>
            <InputBase
              autoFocus
              className={classes.navInput}
              placeholder="crupest"
              value={navText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNavText(event.currentTarget.value);
              }}
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  goto();
                }
              }}
            />
            <IconButton className={classes.navButton} onClick={goto}>
              <Icon>arrow_forward</Icon>
            </IconButton>
          </Paper>
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
