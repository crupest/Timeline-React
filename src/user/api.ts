import React from 'react';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';

import { apiBaseUrl } from '../config';
import { User } from '../data/user';
import { updateQueryString } from '../helper';

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

const avatarVersionSubject = new BehaviorSubject<number | undefined>(undefined);

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
      avatarVersionSubject.next((avatarVersionSubject.value ?? 0) + 1);
    });
}

export const avatarVersion$: Observable<
  number | undefined
> = avatarVersionSubject;

export function useAvatarVersion(): number | undefined {
  const [version, setVersion] = React.useState<number | undefined>();
  React.useEffect(() => {
    const subscription = avatarVersion$.subscribe((v) => setVersion(v));
    return () => subscription.unsubscribe();
  }, []);
  return version;
}

export function useOptionalVersionedAvatarUrl(
  url: string | undefined
): string | undefined {
  const avatarVersion = useAvatarVersion();
  return React.useMemo(
    () =>
      url == null
        ? undefined
        : updateQueryString(
            'v',
            avatarVersion == null ? null : avatarVersion + '',
            url
          ),
    [avatarVersion, url]
  );
}

export function useAvatarUrlWithGivenVersion(
  version: number | null | undefined,
  url: string
): string {
  return React.useMemo(
    () => updateQueryString('v', version == null ? null : version + '', url),
    [version, url]
  );
}
