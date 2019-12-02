import React from 'react';
import { useTranslation } from 'react-i18next';

import { TimelineVisibility, kTimelineVisibilities } from '../data/timeline';

import TimelineVisibilityIcon from './TimelineVisibilityIcon';
import OperationDialog, {
  OperationSelectInputInfoOption
} from '../common/OperationDialog';

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

const labelMap: { [key in TimelineVisibility]: string } = {
  Private: 'timeline.visibility.private',
  Public: 'timeline.visibility.public',
  Register: 'timeline.visibility.register'
};

const TimelinePropertyChangeDialog: React.FC<TimelinePropertyChangeDialogProps> = props => {
  const { t } = useTranslation();
  return (
    <OperationDialog
      title={t('timeline.dialogChangeProperty.title')}
      titleColor="default"
      inputScheme={[
        {
          type: 'select',
          label: t('timeline.dialogChangeProperty.visibility'),
          options: kTimelineVisibilities.map<OperationSelectInputInfoOption>(
            v => {
              return {
                label: t(labelMap[v]),
                value: v,
                icon: <TimelineVisibilityIcon visibility={v} />
              };
            }
          ),
          initValue: props.visibility
        },
        {
          type: 'text',
          label: t('timeline.dialogChangeProperty.description'),
          initValue: props.description,
          variant: 'outlined',
          multiline: true
        }
      ]}
      open={props.open}
      close={props.close}
      onConfirm={async ([newVisibility, newDescription]) => {
        const req: ChangePropertyRequest = {};
        if (newVisibility !== props.visibility) {
          req.visibility = newVisibility as TimelineVisibility;
        }
        if (newDescription !== props.description) {
          req.description = newDescription as string;
        }
        await props.process(req);
      }}
    />
  );
};

export default TimelinePropertyChangeDialog;
