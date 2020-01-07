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
  username: string | null | undefined,
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

export function canDelete(
  username: string | null | undefined,
  timelineOwner: string,
  postAuthor: string
): boolean {
  return username === timelineOwner || username === postAuthor;
}

interface RawCreatePostRequest {
  content: string;
  time?: string;
}

interface RawCreatePostResponse {
  id: number;
  time: string;
}

export interface CreatePostAuthor {
  username: string;
  token: string;
}

export interface CreatePostRequest {
  content: string;
  time?: Date;
}

export async function createPersonalTimelinePost(
  username: string,
  author: CreatePostAuthor,
  request: CreatePostRequest
): Promise<TimelinePostInfo> {
  const rawReq: RawCreatePostRequest = { content: request.content };
  if (request.time != null) {
    rawReq.time = request.time.toISOString();
  }
  const res = await axios.post<RawCreatePostResponse>(
    `${apiBaseUrl}/users/${username}/timeline/postop/create?token=${author.token}`,
    rawReq
  );
  const body = res.data;
  return {
    id: body.id,
    author: author.username,
    content: request.content,
    time: new Date(body.time)
  };
}

interface TimelineDeleteRequest {
  id: number;
}

export async function deletePersonalTimelinePost(
  username: string,
  id: number,
  token: string
): Promise<void> {
  await axios.post(
    `${apiBaseUrl}/users/${username}/timeline/postop/delete?token=${token}`,
    {
      id
    } as TimelineDeleteRequest
  );
}
