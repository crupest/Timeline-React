import React, { useState } from 'react';
import { useParams } from 'react-router';

import { useUser } from '../data/user';
import { changeNickname, changeAvatar } from './http';
import { personalTimelineService } from '../data/timeline';

import UserPage from './UserPage';
import ChangeNicknameDialog from './ChangeNicknameDialog';
import ChangeAvatarDialog from './ChangeAvatarDialog';
import TimelinePageTemplate from '../timeline/TimelinePageTemplate';

const User: React.FC = _ => {
  const { username } = useParams<{ username: string }>();

  const user = useUser();

  const [dialog, setDialog] = useState<null | 'avatar' | 'nickname'>(null);
  const [key, setKey] = useState<number>(0);

  let dialogElement: React.ReactElement | undefined;

  const closeDialogHandler = (): void => {
    setDialog(null);
  };

  if (dialog === 'nickname') {
    dialogElement = (
      <ChangeNicknameDialog
        open
        close={closeDialogHandler}
        onProcess={newNickname => {
          const p = changeNickname(user!.token, username, newNickname);
          return p.then(_ => {
            setKey(key + 1);
          });
        }}
      />
    );
  } else if (dialog === 'avatar') {
    dialogElement = (
      <ChangeAvatarDialog
        open
        close={closeDialogHandler}
        process={file => {
          return changeAvatar(user!.token, username, file, file.type).then(
            _ => {
              setKey(key + 1);
            }
          );
        }}
      />
    );
  }

  return (
    <TimelinePageTemplate
      key={key}
      name={username}
      UiComponent={UserPage}
      onManage={(item: 'avatar' | 'nickname') => {
        setDialog(item);
      }}
      service={personalTimelineService}
      dialog={dialogElement}
    />
  );
};

export default User;
