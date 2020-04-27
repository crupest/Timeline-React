import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import AppBar from '../common/AppBar';

import { userLogin, useUser } from '../data/user';
import {
  Label,
  FormGroup,
  Input,
  Form,
  FormFeedback,
  Spinner,
  Button,
} from 'reactstrap';

const Login: React.FC = (_) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [usernameDirty, setUsernameDirty] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordDirty, setPasswordDirty] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const user = useUser();

  useEffect(() => {
    if (user != null) {
      const id = setTimeout(() => history.push('/'), 3000);
      return () => {
        clearTimeout(id);
      };
    }
  }, [history, user]);

  if (user != null) {
    return (
      <>
        <AppBar />
        <p className="mt-appbar">{t('login.alreadyLogin')}</p>
      </>
    );
  }

  function onSubmit(event: React.SyntheticEvent): void {
    if (username === '' || password === '') {
      setUsernameDirty(true);
      setPasswordDirty(true);
      return;
    }

    setProcess(true);
    userLogin(
      {
        username: username,
        password: password,
      },
      rememberMe
    ).then(
      (_) => {
        if (history.length === 0) {
          history.push('/');
        } else {
          history.goBack();
        }
      },
      (e) => {
        setProcess(false);
        setError(e.message);
      }
    );
    event.preventDefault();
  }

  return (
    <Fragment>
      <AppBar />
      <div className="container login-container mt-appbar">
        <h1>{t('welcome')}</h1>
        <Form>
          <FormGroup>
            <Label for="username">{t('user.username')}</Label>
            <Input
              id="username"
              disabled={process}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameDirty(true);
              }}
              value={username}
              invalid={usernameDirty && username === ''}
            />
            {usernameDirty && username === '' && (
              <FormFeedback>{t('login.emptyUsername')}</FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="password">{t('user.password')}</Label>
            <Input
              id="password"
              type="password"
              disabled={process}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordDirty(true);
              }}
              value={password}
              invalid={passwordDirty && password === ''}
            />
            {passwordDirty && password === '' && (
              <FormFeedback>{t('login.emptyPassword')}</FormFeedback>
            )}
          </FormGroup>
          <FormGroup check>
            <Input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => {
                const v = (e.target as HTMLInputElement).checked;
                setRememberMe(v);
              }}
            />
            <Label for="remember-me">{t('user.rememberMe')}</Label>
          </FormGroup>
          {error ? <p className="text-error">{t(error)}</p> : null}
          <div>
            {process ? (
              <Spinner />
            ) : (
              <Button color="primary" onClick={onSubmit}>
                {t('user.login')}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Fragment>
  );
};

export default Login;
