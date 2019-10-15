import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AppBar from "../common/AppBar";

const useStyles = makeStyles({
  content: {
    padding: 5,
    textAlign: "center"
  }
});

const Home: React.FC = _ => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <div className={classes.content}>
        <Typography variant="h3">{t("welcome")}</Typography>
        <Typography variant="body1">
          This is the first app created by me,{" "}
          <a href="https://github.com/crupest" target="_blank">
            crupest
          </a>
          .
        </Typography>
      </div>
    </>
  );
};

export default Home;
