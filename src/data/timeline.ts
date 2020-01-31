import axios, { AxiosResponse } from 'axios';

import { apiBaseUrl } from '../config';
import { User, UserAuthInfo } from './user';

export const kTimelineVisibilities = ['Public', 'Register', 'Private'] as const;

export type TimelineVisibility = typeof kTimelineVisibilities[number];

export interface BaseTimelineInfo {
  description: string;
  owner: User;
  visibility: TimelineVisibility;
  members: User[];
}

export interface TimelinePostInfo {
  id: number;
  content: string;
  time: Date;
  author: User;
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
  author: User;
}

function processRawTimelinePostInfo(
  raw: RawTimelinePostInfo
): TimelinePostInfo {
  return {
    ...raw,
    time: new Date(raw.time)
  };
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
  return res.data.map(p => processRawTimelinePostInfo(p));
}

export function isMemberOf(
  user: UserAuthInfo | null | undefined,
  timeline: BaseTimelineInfo
): boolean {
  if (user == null) {
    return false;
  } else {
    const { username } = user;
    return timeline.members.findIndex(m => m.username == username) >= 0;
  }
}

export function canSee(
  user: UserAuthInfo | null | undefined,
  timeline: BaseTimelineInfo
): boolean {
  if (user != null && user.administrator) return true;

  const { visibility } = timeline;
  if (visibility === 'Public') {
    return true;
  } else if (visibility === 'Register') {
    if (user != null) return true;
  } else if (visibility === 'Private') {
    if (isMemberOf(user, timeline)) {
      return true;
    }
  }
  return false;
}

export function canManage(
  user: UserAuthInfo | null | undefined,
  timeline: BaseTimelineInfo
): boolean {
  if (user != null && user.administrator) return true;

  return user != null && user.username == timeline.owner.username;
}

export function canPost(
  user: UserAuthInfo | null | undefined,
  timeline: BaseTimelineInfo
): boolean {
  if (user != null && user.administrator) return true;

  return (
    user != null &&
    (timeline.owner.username === user.username || isMemberOf(user, timeline))
  );
}

export function canModifyPost(
  user: UserAuthInfo | null | undefined,
  timeline: BaseTimelineInfo,
  post: TimelinePostInfo
): boolean {
  if (user != null && user.administrator) return true;

  return (
    user != null &&
    (user.username === timeline.owner.username ||
      user.username === post.author.username)
  );
}

interface RawCreatePostRequest {
  content: string;
  time?: string;
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
  const res = await axios.post<RawTimelinePostInfo>(
    `${apiBaseUrl}/users/${username}/timeline/posts?token=${author.token}`,
    rawReq
  );
  const body = res.data;
  return processRawTimelinePostInfo(body);
}

export async function deletePersonalTimelinePost(
  username: string,
  id: number,
  token: string
): Promise<void> {
  await axios.delete(
    `${apiBaseUrl}/users/${username}/timeline/posts/${id}?token=${token}`
  );
}

export async function addPersonalTimelineMember(
  username: string,
  memberUsername: string,
  token: string
): Promise<void> {
  await axios.put(
    `${apiBaseUrl}/users/${username}/timeline/members/${memberUsername}?token=${token}`
  );
}

export async function removePersonalTimelineMember(
  username: string,
  memberUsername: string,
  token: string
): Promise<void> {
  await axios.delete(
    `${apiBaseUrl}/users/${username}/timeline/members/${memberUsername}?token=${token}`
  );
}
