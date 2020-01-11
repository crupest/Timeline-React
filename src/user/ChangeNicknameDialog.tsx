import React from 'react';

import OperationDialog from '../common/OperationDialog';

export interface ChangeNicknameDialogProps {
  open: boolean;
  close: () => void;
  onProcess: (newNickname: string) => Promise<void>;
}

const ChangeNicknameDialog: React.FC<ChangeNicknameDialogProps> = props => {
  return (
    <OperationDialog
      open={props.open}
      title="userPage.dialogChangeNickname.title"
      titleColor="default"
      inputScheme={[
        { type: 'text', label: 'userPage.dialogChangeNickname.inputLabel' }
      ]}
      onProcess={([newNickname]) => {
        return props.onProcess(newNickname as string);
      }}
      close={props.close}
    />
  );
};

export default ChangeNicknameDialog;
