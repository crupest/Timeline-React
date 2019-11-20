import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Icon,
  ListItemText,
  Select,
  MenuItem,
  ListSubheader
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AppBar from "../common/AppBar";

const Settings: React.FC = _ => {
  const { i18n, t } = useTranslation();
  const language = i18n.language.slice(0, 2);

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <List>
        <ListSubheader>{t("settings.subheaders.account")}</ListSubheader>
        <ListItem>
          <ListItemText
            primary={t("settings.changePassword")}
            primaryTypographyProps={{ color: "error" }}
          />
        </ListItem>
        <ListSubheader>{t("settings.subheaders.customization")}</ListSubheader>
        <ListItem>
          <ListItemIcon>
            <Icon>translate</Icon>
          </ListItemIcon>
          <ListItemText
            primary={t("settings.languagePrimary")}
            secondary={t("settings.languageSecondary")}
          />
          <Select
            value={language}
            onChange={e => {
              i18n.changeLanguage(e.target.value as string);
            }}
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </ListItem>
      </List>
    </>
  );
};

export default Settings;
