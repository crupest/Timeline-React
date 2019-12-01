import React from 'react';

import { TimelineVisibility, kTimelineVisibilities } from '../data/timeline';
import OperationDialog, {
  OperationSelectInputInfoOption
} from '../common/OperationDialog';
import TimelineVisibilityIcon from './TimelineVisibilityIcon';

export interface ChangePropertyRequest {
  visibility?: TimelineVisibility;
  description?: string;
}

export interface TimelinePropertyChangeDialogProps {
  open: boolean;
  close: () => void;
  visibility: TimelineVisibility;
  description: string;
  process: (request: ChangePropertyRequest) => Promise<void>;
}

const TimelinePropertyChangeDialog: React.FC<TimelinePropertyChangeDialogProps> = props => {
  return (
    <OperationDialog
      title="Change timeline properties."
      titleColor="default"
      inputScheme={[
        {
          type: 'select',
          label: 'Visibility',
          options: kTimelineVisibilities.map<OperationSelectInputInfoOption>(
            v => {
              return {
                label: v,
                value: v,
                icon: <TimelineVisibilityIcon visibility={v} />
              };
            }
          ),
          initValue: props.visibility
        },
        {
          type: 'text',
          label: 'Description',
          initValue: props.description,
          variant: 'outlined',
          multiline: true
        }
      ]}
      open={props.open}
      close={props.close}
      onConfirm={async () => {
        //TODO
      }}
    />
  );
};

export default TimelinePropertyChangeDialog;
