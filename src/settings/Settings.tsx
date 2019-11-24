import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  Icon,
  ListItemText,
  Select,
  MenuItem,
  ListSubheader
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { apiBaseUrl } from '../config';

import { useUser, userLogout } from '../data/user';

import AppBar from '../common/AppBar';
import OperationDialog from '../common/OperationDialog';
import { useHistory } from 'react-router';

interface ChangePasswordDialogProps {
  open: boolean;
  close: () => void;
}

async function changePassword(
  oldPassword: string,
  newPassword: string,
  token: string
): Promise<void> {
  const url = `${apiBaseUrl}/userop/changepassword?token=${token}`;
  await axios.post(url, {
    oldPassword,
    newPassword
  });
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = props => {
  const user = useUser()!;
  const history = useHistory();

  const [redirect, setRedirect] = useState<boolean>(false);

  return (
    <OperationDialog
      open={props.open}
      title="Change password"
      titleColor="dangerous"
      inputScheme={[
        {
          type: 'text',
          label: 'old password',
          password: true
        },
        { type: 'text', label: 'new password', password: true },
        { type: 'text', label: 'retype new password', password: true }
      ]}
      onConfirm={async ([oldPassword, newPassword, retypeNewPassword]) => {
        if (newPassword !== retypeNewPassword) {
          throw new Error('Two new passwords are not the same.');
        }
        await changePassword(
          oldPassword as string,
          newPassword as string,
          user.token
        );
        userLogout();
        setRedirect(true);
      }}
      close={() => {
        props.close && props.close();
        if (redirect) {
          history.push('/login');
        }
      }}
    />
  );
};

const Settings: React.FC = _ => {
  const { i18n, t } = useTranslation();
  const user = useUser();

  const [dialog, setDialog] = useState<null | 'changepassword'>(null);

  const language = i18n.language.slice(0, 2);

  return (
    <>
      <AppBar />
      <div style={{ height: 56 }} />
      <List>
        {user ? (
          <>
            <ListSubheader>{t('settings.subheaders.account')}</ListSubheader>
            <ListItem
              button
              onClick={() => {
                setDialog('changepassword');
              }}
            >
              <ListItemText
                primary={t('settings.changePassword')}
                primaryTypographyProps={{ color: 'error' }}
              />
            </ListItem>
          </>
        ) : null}
        <ListSubheader>{t('settings.subheaders.customization')}</ListSubheader>
        <ListItem>
          <ListItemIcon>
            <Icon>translate</Icon>
          </ListItemIcon>
          <ListItemText
            primary={t('settings.languagePrimary')}
            secondary={t('settings.languageSecondary')}
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
      {dialog === 'changepassword' ? (
        <ChangePasswordDialog
          open
          close={() => {
            setDialog(null);
          }}
        />
      ) : null}
    </>
  );
};

export default Settings;
