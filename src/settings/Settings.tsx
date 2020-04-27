import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import axios, { AxiosError } from 'axios';
import { Container, Row, Col, Input } from 'reactstrap';

import { apiBaseUrl } from '../config';

import { useUser, userLogout } from '../data/user';

import AppBar from '../common/AppBar';
import OperationDialog, {
  OperationInputErrorInfo,
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
      newPassword,
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

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = (props) => {
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
          password: true,
          validator: (v) =>
            v === ''
              ? 'settings.dialogChangePassword.errorEmptyOldPassword'
              : null,
        },
        {
          type: 'text',
          label: t('settings.dialogChangePassword.inputNewPassword'),
          password: true,
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
          },
        },
        {
          type: 'text',
          label: t('settings.dialogChangePassword.inputRetypeNewPassword'),
          password: true,
          validator: (v, values) =>
            v !== values[1]
              ? 'settings.dialogChangePassword.errorRetypeNotMatch'
              : null,
        },
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

const Settings: React.FC = (_) => {
  const { i18n, t } = useTranslation();
  const user = useUser();
  const history = useHistory();

  const [dialog, setDialog] = useState<null | 'changepassword'>(null);

  const language = i18n.language.slice(0, 2);

  return (
    <>
      <AppBar />
      <Container fluid style={{ marginTop: '56px' }}>
        {user ? (
          <>
            <Row className="border-bottom p-3">
              <Col className="col-12">
                <h5
                  onClick={() => {
                    history.push(`/users/${user.username}`);
                  }}
                >
                  {t('settings.gotoSelf')}
                </h5>
              </Col>
            </Row>
            <Row className="border-bottom p-3">
              <Col className="col-12">
                <h5
                  className="text-danger"
                  onClick={() => setDialog('changepassword')}
                >
                  {t('settings.changePassword')}
                </h5>
              </Col>
            </Row>
            <Row className="border-bottom p-3">
              <Col className="col-12">
                <h5
                  className="text-danger"
                  onClick={() => {
                    userLogout();
                    history.push('/');
                  }}
                >
                  {t('settings.logout')}
                </h5>
              </Col>
            </Row>
          </>
        ) : null}
        <Row className="align-items-center border-bottom p-3">
          <Col className="col-12 col-sm">
            <h5>{t('settings.languagePrimary')}</h5>
            <p>{t('settings.languageSecondary')}</p>
          </Col>
          <Col className="col-auto ml-auto">
            <Input
              type="select"
              value={language}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
              }}
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </Input>
          </Col>
        </Row>
        {dialog === 'changepassword' ? (
          <ChangePasswordDialog
            open
            close={() => {
              setDialog(null);
            }}
          />
        ) : null}
      </Container>
    </>
  );
};

export default Settings;
