import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Link } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";

import AppBar from "../common/AppBar";

const hToColor = (h: number) => `hsl(${h} 70% 70%)`;

const useStyles = makeStyles({
  content: {
    padding: 5,
    textAlign: "center"
  },
  "@keyframes welcome": {
    "0%": {
      color: hToColor(0)
    },
    "16.66%": {
      color: hToColor(60)
    },
    "33.33%": {
      color: hToColor(120)
    },
    "50%": {
      color: hToColor(180)
    },
    "66.66%": {
      color: hToColor(240)
    },
    "83.33%": {
      color: hToColor(300)
    },
    "100%": {
      color: hToColor(360)
    }
  },
  welcome: {
    animationName: "$welcome",
    animationDuration: "10s",
    animationIterationCount: "infinite"
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
        <Typography variant="h4" classes={{ root: classes.welcome }}>
          {t("welcome")}
        </Typography>
        <Trans i18nKey="home.description">
          <Typography variant="body1">
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
          <Typography variant="body1">0</Typography>
        </Trans>
      </div>
    </>
  );
};

export default Home;
