import React, { useState } from 'react';
import { useParams } from 'react-router';

import { useUser } from '../data/user';
import { changeNickname, changeAvatar } from './api';
import { personalTimelineService } from '../data/timeline';

import UserPage from './UserPage';
import ChangeNicknameDialog from './ChangeNicknameDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import TimelinePageTemplate from '../timeline/TimelinePageTemplate';
import { PersonalTimelineManageItem } from './UserInfoCard';

const User: React.FC = (_) => {
  const { username } = useParams<{ username: string }>();

  const user = useUser();

  const [dialog, setDialog] = useState<null | PersonalTimelineManageItem>(null);
  const [dataKey, setDataKey] = useState<number>(0);

  let dialogElement: React.ReactElement | undefined;

  const closeDialogHandler = (): void => {
    setDialog(null);
  };

  if (dialog === 'nickname') {
    dialogElement = (
      <ChangeNicknameDialog
        open
        close={closeDialogHandler}
        onProcess={(newNickname) => {
          const p = changeNickname(user!.token, username, newNickname);
          return p.then((_) => {
            setDataKey(dataKey + 1);
          });
        }}
      />
    );
  } else if (dialog === 'avatar') {
    dialogElement = (
      <ChangeAvatarDialog
        open
        close={closeDialogHandler}
        process={(file) => changeAvatar(user!.token, username, file, file.type)}
      />
    );
  }

  const onManage = React.useCallback((item: PersonalTimelineManageItem) => {
    setDialog(item);
  }, []);

  return (
    <>
      <TimelinePageTemplate
        dataVersion={dataKey}
        name={username}
        UiComponent={UserPage}
        onManage={onManage}
        service={personalTimelineService}
        notFoundI18nKey="timeline.userNotExist"
      />
      {dialogElement}
    </>
  );
};

export default User;
