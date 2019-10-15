import React, { Fragment, useState } from "react";
import { useHistory } from "react-router";
import {
  TextField,
  Checkbox,
  Button,
  CircularProgress,
  Typography,
  FormControlLabel,
  makeStyles
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AppBar from "../common/AppBar";

import { userLogin } from "../data/user";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  welcome: {
    margin: "20px 0"
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "stretch"
  },
  formBody: {
    padding: "10px 20px",
    maxWidth: "350px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },
  error: {
    color: "red"
  },
  submitBox: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px"
  }
});

const Login: React.FC = _ => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.SyntheticEvent) {
    setProcess(true);
    userLogin(
      {
        username: username,
        password: password
      },
      rememberMe
    ).then(
      _ => {
        history.goBack();
      },
      e => {
        setProcess(false);
        setError(e.toString());
      }
    );
    event.preventDefault();
  }

  return (
    <Fragment>
      <AppBar />
      <div style={{ height: 56 }}></div>
      <div className={classes.root}>
        <Typography className={classes.welcome} variant="h4">
          {t("welcome")}
        </Typography>
        <form className={classes.form}>
          <div className={classes.formBody}>
            <TextField
              label={t("user.username")}
              disabled={process}
              onChange={e => {
                setUsername(e.target.value);
              }}
              value={username}
              fullWidth
            />
            <TextField
              label={t("user.password")}
              disabled={process}
              type="password"
              onChange={e => {
                setPassword(e.target.value);
              }}
              value={password}
              fullWidth
            />
            <FormControlLabel
              value={rememberMe}
              onChange={e => {
                const v = (e.target as HTMLInputElement).checked;
                setRememberMe(v);
              }}
              control={<Checkbox />}
              label={t("user.rememberMe")}
            />
            {error ? <div className={classes.error}>{error}</div> : null}
            <div className={classes.submitBox}>
              {process ? (
                <CircularProgress size={50} />
              ) : (
                <Button variant="contained" color="primary" onClick={onSubmit}>
                  {t("user.login")}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;
