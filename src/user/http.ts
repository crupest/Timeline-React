import axios from 'axios';

import { apiBaseUrl } from '../config';
import { TimelineChangePropertyRequest } from '../timeline/TimelinePropertyChangeDialog';

export function changeNickname(
  token: string,
  username: string,
  newNickname: string
): Promise<void> {
  return axios.put(
    `${apiBaseUrl}/users/${username}/nickname?token=${token}`,
    newNickname,
    {
      headers: {
        'Content-Type': 'text/plain'
      }
    }
  );
}

export function changeTimelineProperty(
  token: string,
  username: string,
  req: TimelineChangePropertyRequest
): Promise<void> {
  return axios.post(
    `${apiBaseUrl}/users/${username}/timeline/op/property?token=${token}`,
    req
  );
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
