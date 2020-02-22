import React from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';

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

  let nameSaved: string;

  return (
    <OperationDialog
      open={props.open}
      close={props.close}
      titleColor="success"
      title="Create Timeline"
      inputScheme={[
        {
          type: 'text',
          label: 'name'
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
    />
  );
};

export default TimelineCreateDialog;
