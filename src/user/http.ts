import axios from 'axios';

import { apiBaseUrl } from '../config';
import { User } from '../data/user';
import { BaseTimelineInfo } from '../data/timeline';
import { TimelineChangePropertyRequest } from '../timeline/TimelinePropertyChangeDialog';

export async function changeNickname(
  token: string,
  username: string,
  newNickname: string
): Promise<User> {
  const res = await axios.patch<User>(
    `${apiBaseUrl}/users/${username}?token=${token}`,
    {
      nickname: newNickname
    }
  );
  return res.data;
}

export async function changeTimelineProperty(
  token: string,
  username: string,
  req: TimelineChangePropertyRequest
): Promise<BaseTimelineInfo> {
  const res = await axios.patch<BaseTimelineInfo>(
    `${apiBaseUrl}/users/${username}/timeline?token=${token}`,
    req
  );
  return res.data;
}

export function changeAvatar(
  token: string,
  username: string,
  data: Blob,
  type: string
): Promise<void> {
  return axios.put(
    `${apiBaseUrl}/users/${username}/avatar?token=${token}`,
    data,
    {
      headers: {
        'Content-Type': type
      }
    }
  );
}
