import React, { useState, useEffect } from "react";
import { makeStyles, Typography, Link } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AppBar from "../common/AppBar";

interface StyleProps {
  welcomeColorH: number;
}

const useStyles = makeStyles({
  content: {
    padding: 5,
    textAlign: "center"
  },
  welcome: {
    transition: "color 4s",
    color: (props: StyleProps) => `hsl(${props.welcomeColorH} 70% 70%)`
  }
});

const Home: React.FC = _ => {
  const { t } = useTranslation();
  const [welcomeColorH, setWelcomeColorH] = useState<number>(0);

  useEffect(() => {
    const ti = setTimeout(() => {
      let newH = welcomeColorH + 60;
      if (newH >= 360) {
        newH = 0;
      }
      setWelcomeColorH(newH);
    }, 4000);
    return () => {
      clearTimeout(ti);
    };
  }, [welcomeColorH]);

  const classes = useStyles({
    welcomeColorH: welcomeColorH
  });

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <div className={classes.content}>
        <Typography variant="h4" classes={{ root: classes.welcome }}>
          {t("welcome")}
        </Typography>
        <Typography variant="body1">
          {t("home.description.p1.0")}
          <Link href="https://github.com/crupest" target="_blank">
            crupest
          </Link>
          {t("home.description.p1.2")}
          <Link
            href="https://github.com/crupest/Timeline-React"
            target="_blank"
          >
            {t("home.description.p1.3")}
          </Link>
          {t("home.description.p1.4")}
          <Link href="https://github.com/crupest/Timeline" target="_blank">
            {t("home.description.p1.5")}
          </Link>
          {t("home.description.p1.6")}
        </Typography>
        <Typography variant="body1">{t("home.description.p2.0")}</Typography>
      </div>
    </>
  );
};

export default Home;
