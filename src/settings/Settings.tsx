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
import axios, { AxiosError } from 'axios';
import { useHistory } from 'react-router';

import { apiBaseUrl } from '../config';

import { useUser, userLogout } from '../data/user';

import AppBar from '../common/AppBar';
import OperationDialog, {
  OperationInputErrorInfo
} from '../common/OperationDialog';

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
  try {
    await axios.post(url, {
      oldPassword,
      newPassword
    });
  } catch (e) {
    const error = e as AxiosError;
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data &&
      error.response.data.message
    ) {
      throw error.response.data.message;
    }
    throw e;
  }
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = props => {
  const user = useUser()!;
  const history = useHistory();
  const { t } = useTranslation();

  const [redirect, setRedirect] = useState<boolean>(false);

  return (
    <OperationDialog
      open={props.open}
      title={t('settings.dialogChangePassword.title')}
      titleColor="dangerous"
      inputPrompt={t('settings.dialogChangePassword.prompt')}
      inputScheme={[
        {
          type: 'text',
          label: t('settings.dialogChangePassword.inputOldPassword'),
          textFieldProps: {
            type: 'password'
          },
          validator: v =>
            v === ''
              ? 'settings.dialogChangePassword.errorEmptyOldPassword'
              : null
        },
        {
          type: 'text',
          label: t('settings.dialogChangePassword.inputNewPassword'),
          textFieldProps: {
            type: 'password'
          },
          validator: (v, values) => {
            const error: OperationInputErrorInfo = {};
            error[1] =
              v === ''
                ? 'settings.dialogChangePassword.errorEmptyNewPassword'
                : null;
            if (v === values[2]) {
              error[2] = null;
            } else {
              if (values[2] !== '') {
                error[2] = 'settings.dialogChangePassword.errorRetypeNotMatch';
              }
            }
            return error;
          }
        },
        {
          type: 'text',
          label: t('settings.dialogChangePassword.inputRetypeNewPassword'),
          textFieldProps: {
            type: 'password'
          },
          validator: (v, values) =>
            v !== values[1]
              ? 'settings.dialogChangePassword.errorRetypeNotMatch'
              : null
        }
      ]}
      onProcess={async ([oldPassword, newPassword]) => {
        await changePassword(
          oldPassword as string,
          newPassword as string,
          user.token
        );
        userLogout();
        setRedirect(true);
      }}
      close={() => {
        props.close();
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
