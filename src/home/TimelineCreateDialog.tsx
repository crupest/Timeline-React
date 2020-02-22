import React from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { apiBaseUrl } from '../config';
import { useUser } from '../data/user';

import OperationDialog from '../common/OperationDialog';

interface TimelineCreateDialogProps {
  open: boolean;
  close: () => void;
}

const TimelineCreateDialog: React.FC<TimelineCreateDialogProps> = props => {
  const history = useHistory();
  const user = useUser()!;
  const { t } = useTranslation();

  let nameSaved: string;

  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      titleColor="success"
      title={t('home.createDialog.title')}
      inputScheme={[
        {
          type: 'text',
          label: t('home.createDialog.name'),
          helperText: t('home.createDialog.nameFormat'),
          validator: name => {
            if (name.length === 0) {
              return t('home.createDialog.noEmpty');
            } else if (name.length > 26) {
              return t('home.createDialog.tooLong');
            } else if (/[^-_a-zA-Z0-9]/.test(name)) {
              return t('home.createDialog.badFormat');
            } else {
              return null;
            }
          }
        }
      ]}
      onProcess={([name]) => {
        nameSaved = name as string;
        return axios.post(`${apiBaseUrl}/timelines?token=${user.token}`, {
          name
        });
      }}
      onSuccessAndClose={() => {
        history.push(`timelines/${nameSaved}`);
      }}
      failurePrompt={e => (e as object).toString()}
    />
  );
};

export default TimelineCreateDialog;
