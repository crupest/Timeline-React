import React from 'react';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';

import { apiBaseUrl } from '../config';
import { User } from '../data/user';

export function changeNickname(
  token: string,
  username: string,
  newNickname: string
): Promise<User> {
  return axios
    .patch<User>(`${apiBaseUrl}/users/${username}?token=${token}`, {
      nickname: newNickname,
    })
    .then((res) => res.data);
}

const avatarVersionSubject = new BehaviorSubject<number>(0);

export function changeAvatar(
  token: string,
  username: string,
  data: Blob,
  type: string
): Promise<void> {
  return axios
    .put(`${apiBaseUrl}/users/${username}/avatar?token=${token}`, data, {
      headers: {
        'Content-Type': type,
      },
    })
    .then(() => {
      avatarVersionSubject.next(avatarVersionSubject.value + 1);
    });
}

export const avatarVersion$: Observable<number> = avatarVersionSubject;

export function useAvatarVersion(): number {
  const [version, setVersion] = React.useState<number>(0);
  React.useEffect(() => {
    const subscription = avatarVersion$.subscribe((v) => setVersion(v));
    return () => subscription.unsubscribe();
  }, []);
  return version;
}
