import axios, { AxiosResponse } from 'axios';

import { apiBaseUrl } from '../config';

export const kTimelineVisibilities = ['Public', 'Register', 'Private'] as const;

export type TimelineVisibility = typeof kTimelineVisibilities[number];

export interface BaseTimelineInfo {
  description: string;
  owner: string;
  visibility: TimelineVisibility;
  members: string[];
}

export interface TimelinePostInfo {
  id: number;
  content: string;
  time: Date;
  author: string;
}

export function fetchPersonalTimeline(
  username: string
): Promise<AxiosResponse<BaseTimelineInfo>> {
  return axios.get<BaseTimelineInfo>(
    `${apiBaseUrl}/users/${username}/timeline`
  );
}

interface RawTimelinePostInfo {
  id: number;
  content: string;
  time: string;
  author: string;
}

export async function fetchPersonalTimelinePosts(
  username: string,
  token: string | null | undefined
): Promise<TimelinePostInfo[]> {
  const res = await axios.get<RawTimelinePostInfo[]>(
    token == null
      ? `${apiBaseUrl}/users/${username}/timeline/posts`
      : `${apiBaseUrl}/users/${username}/timeline/posts?token=${token}`
  );
  return res.data.map(p => ({
    ...p,
    time: new Date(p.time)
  }));
}

export function canSee(
  username: string | null,
  timeline: BaseTimelineInfo
): boolean {
  const { visibility, members } = timeline;
  if (visibility === 'Public') {
    return true;
  } else if (visibility === 'Register') {
    if (username != null) return true;
  } else if (visibility === 'Private') {
    if (username != null && members.includes(username)) {
      return true;
    }
  }
  return false;
}

export function canPost(
  username: string | null | undefined,
  timeline: BaseTimelineInfo | null | undefined
): boolean {
  if (
    username != null &&
    timeline != null &&
    (timeline.owner === username || timeline.members.includes(username))
  ) {
    return true;
  }
  return false;
}
