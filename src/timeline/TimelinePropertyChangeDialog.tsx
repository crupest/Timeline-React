import React from 'react';

import { TimelineVisibility, kTimelineVisibilities } from '../data/timeline';

import TimelineVisibilityIcon from './TimelineVisibilityIcon';
import OperationDialog, {
  OperationSelectInputInfoOption
} from '../common/OperationDialog';

export interface TimelinePropertyInfo {
  visibility: TimelineVisibility;
  description: string;
}

export interface ChangePropertyRequest {
  visibility?: TimelineVisibility;
  description?: string;
}

export interface TimelinePropertyChangeDialogProps {
  open: boolean;
  close: () => void;
  oldInfo: TimelinePropertyInfo;
  process: (request: ChangePropertyRequest) => Promise<void>;
}

const labelMap: { [key in TimelineVisibility]: string } = {
  Private: 'timeline.visibility.private',
  Public: 'timeline.visibility.public',
  Register: 'timeline.visibility.register'
};

const TimelinePropertyChangeDialog: React.FC<TimelinePropertyChangeDialogProps> = props => {
  return (
    <OperationDialog
      title={'timeline.dialogChangeProperty.title'}
      titleColor="default"
      inputScheme={[
        {
          type: 'select',
          label: 'timeline.dialogChangeProperty.visibility',
          options: kTimelineVisibilities.map<OperationSelectInputInfoOption>(
            v => ({
              label: labelMap[v],
              value: v,
              icon: <TimelineVisibilityIcon visibility={v} />
            })
          ),
          initValue: props.oldInfo.visibility
        },
        {
          type: 'text',
          label: 'timeline.dialogChangeProperty.description',
          initValue: props.oldInfo.description,
          textFieldProps: { variant: 'outlined', multiline: true }
        }
      ]}
      open={props.open}
      close={props.close}
      onProcess={async ([newVisibility, newDescription]) => {
        const req: ChangePropertyRequest = {};
        if (newVisibility !== props.oldInfo.visibility) {
          req.visibility = newVisibility as TimelineVisibility;
        }
        if (newDescription !== props.oldInfo.description) {
          req.description = newDescription as string;
        }
        await props.process(req);
      }}
    />
  );
};

export default TimelinePropertyChangeDialog;
