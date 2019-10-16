import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Icon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  makeStyles
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AppBar from "../common/AppBar";

const useStyles = makeStyles({
  root: {
    paddingRight: 80
  }
});

const Settings: React.FC = _ => {
  const classes = useStyles();
  const { i18n, t } = useTranslation();
  const language = i18n.language.slice(0, 2);

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <List>
        <ListItem classes={{ root: classes.root }}>
          <ListItemIcon>
            <Icon>translate</Icon>
          </ListItemIcon>
          <ListItemText
            primary={t("settings.languagePrimary")}
            secondary={t("settings.languageSecondary")}
          />
          <ListItemSecondaryAction>
            <Select
              value={language}
              onChange={e => {
                i18n.changeLanguage(e.target.value as string);
              }}
            >
              <MenuItem value="zh">中文</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  );
};

export default Settings;
