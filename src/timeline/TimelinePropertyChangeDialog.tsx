import React from 'react';

import {
  TimelineVisibility,
  kTimelineVisibilities,
  PersonalTimelineChangePropertyRequest
} from '../data/timeline';

import OperationDialog, {
  OperationSelectInputInfoOption
} from '../common/OperationDialog';

export interface TimelinePropertyInfo {
  visibility: TimelineVisibility;
  description: string;
}

export interface TimelinePropertyChangeDialogProps {
  open: boolean;
  close: () => void;
  oldInfo: TimelinePropertyInfo;
  onProcess: (request: PersonalTimelineChangePropertyRequest) => Promise<void>;
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
              value: v
            })
          ),
          initValue: props.oldInfo.visibility
        },
        {
          type: 'text',
          label: 'timeline.dialogChangeProperty.description',
          initValue: props.oldInfo.description
        }
      ]}
      open={props.open}
      close={props.close}
      onProcess={([newVisibility, newDescription]) => {
        const req: PersonalTimelineChangePropertyRequest = {};
        if (newVisibility !== props.oldInfo.visibility) {
          req.visibility = newVisibility as TimelineVisibility;
        }
        if (newDescription !== props.oldInfo.description) {
          req.description = newDescription as string;
        }
        return props.onProcess(req);
      }}
    />
  );
};

export default TimelinePropertyChangeDialog;
