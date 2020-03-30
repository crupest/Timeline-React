import axios from 'axios';
import XRegExp from 'xregexp';

import { base64 } from './base64';
import { apiBaseUrl } from '../config';
import { User, UserAuthInfo, getCurrentUser, UserWithToken } from './user';

export const kTimelineVisibilities = ['Public', 'Register', 'Private'] as const;

export type TimelineVisibility = typeof kTimelineVisibilities[number];

export const timelineVisibilityTooltipTranslationMap: Record<
  TimelineVisibility,
  string
> = {
  Public: 'timeline.visibilityTooltip.public',
  Register: 'timeline.visibilityTooltip.register',
  Private: 'timeline.visibilityTooltip.private',
};

export interface TimelineInfo {
  name: string;
  description: string;
  owner: User;
  visibility: TimelineVisibility;
  members: User[];
  _links: {
    posts: string;
  };
}

export interface TimelinePostTextContent {
  type: 'text';
  text: string;
}

export interface TimelinePostImageContent {
  type: 'image';
  url: string;
}

export type TimelinePostContent =
  | TimelinePostTextContent
  | TimelinePostImageContent;

export interface TimelinePostInfo {
  id: number;
  content: TimelinePostContent;
  time: Date;
  author: User;
}

export interface CreatePostRequestTextContent {
  type: 'text';
  text: string;
}

export interface CreatePostRequestImageContent {
  type: 'image';
  data: Blob;
}

export type CreatePostRequestContent =
  | CreatePostRequestTextContent
  | CreatePostRequestImageContent;

export interface CreatePostRequest {
  content: CreatePostRequestContent;
  time?: Date;
}

// TODO: Remove in the future
export interface TimelineChangePropertyRequest {
  visibility?: TimelineVisibility;
  description?: string;
}

export interface PersonalTimelineChangePropertyRequest {
  visibility?: TimelineVisibility;
  description?: string;
}

export interface OrdinaryTimelineChangePropertyRequest {
  // not supported by server now
  // name?: string;
  visibility?: TimelineVisibility;
  description?: string;
}

//-------------------- begin: internal model --------------------

interface RawTimelinePostTextContent {
  type: 'text';
  text: string;
}

interface RawTimelinePostImageContent {
  type: 'image';
  url: string;
}

type RawTimelinePostContent =
  | RawTimelinePostTextContent
  | RawTimelinePostImageContent;

interface RawTimelinePostInfo {
  id: number;
  content: RawTimelinePostContent;
  time: string;
  author: User;
}

interface RawCreatePostRequestTextContent {
  type: 'text';
  text: string;
}

interface RawCreatePostRequestImageContent {
  type: 'text';
  data: string;
}

type RawCreatePostRequestContent =
  | RawCreatePostRequestTextContent
  | RawCreatePostRequestImageContent;

interface RawCreatePostRequest {
  content: RawCreatePostRequestContent;
  time?: string;
}

//-------------------- end: internal model --------------------

function processRawTimelinePostInfo(
  raw: RawTimelinePostInfo,
  token?: string
): TimelinePostInfo {
  return {
    ...raw,
    content: (() => {
      if (raw.content.type === 'image' && token != null) {
        return {
          ...raw.content,
          url: raw.content.url + '?token=' + token,
        };
      }
      return raw.content;
    })(),
    time: new Date(raw.time),
  };
}

type TimelineUrlResolver = (name: string) => string;

export class TimelineServiceTemplate<
  TTimeline extends TimelineInfo,
  TChangePropertyRequest
> {
  private checkUser(): UserWithToken {
    const user = getCurrentUser();
    if (user == null) {
      throw new Error('You must login to perform the operation.');
    }
    return user;
  }

  constructor(private urlResolver: TimelineUrlResolver) {}

  changeProperty(
    name: string,
    req: TChangePropertyRequest
  ): Promise<TTimeline> {
    const user = this.checkUser();

    return axios
      .patch<TTimeline>(`${this.urlResolver(name)}?token=${user.token}`, req)
      .then((res) => res.data);
  }

  fetch(name: string): Promise<TTimeline> {
    return axios
      .get<TTimeline>(`${this.urlResolver(name)}`)
      .then((res) => res.data);
  }

  fetchPosts(name: string): Promise<TimelinePostInfo[]> {
    const token = getCurrentUser()?.token;
    return axios
      .get<RawTimelinePostInfo[]>(
        token == null
          ? `${this.urlResolver(name)}/posts`
          : `${this.urlResolver(name)}/posts?token=${token}`
      )
      .then((res) => res.data.map((p) => processRawTimelinePostInfo(p, token)));
  }

  createPost(
    name: string,
    request: CreatePostRequest
  ): Promise<TimelinePostInfo> {
    const user = this.checkUser();

    const rawReq: Promise<RawCreatePostRequest> = new Promise<
      RawCreatePostRequestContent
    >((resolve) => {
      if (request.content.type === 'image') {
        base64(request.content.data).then((d) =>
          resolve({
            ...request.content,
            data: d,
          } as RawCreatePostRequestImageContent)
        );
      } else {
        resolve(request.content);
      }
    }).then((content) => {
      const rawReq: RawCreatePostRequest = {
        content,
      };
      if (request.time != null) {
        rawReq.time = request.time.toISOString();
      }
      return rawReq;
    });

    return rawReq
      .then((req) =>
        axios.post<RawTimelinePostInfo>(
          `${this.urlResolver(name)}/posts?token=${user.token}`,
          req
        )
      )
      .then((res) => processRawTimelinePostInfo(res.data, user.token));
  }

  deletePost(name: string, id: number): Promise<void> {
    const user = this.checkUser();

    return axios.delete(
      `${this.urlResolver(name)}/posts/${id}?token=${user.token}`
    );
  }

  addMember(name: string, username: string): Promise<void> {
    const user = this.checkUser();

    return axios.put(
      `${this.urlResolver(name)}/members/${username}?token=${user.token}`
    );
  }

  removeMember(name: string, username: string): Promise<void> {
    const user = this.checkUser();

    return axios.delete(
      `${this.urlResolver(name)}/members/${username}?token=${user.token}`
    );
  }

  isMemberOf(username: string, timeline: TTimeline): boolean {
    return timeline.members.findIndex((m) => m.username == username) >= 0;
  }

  hasReadPermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline
  ): boolean {
    if (user != null && user.administrator) return true;

    const { visibility } = timeline;
    if (visibility === 'Public') {
      return true;
    } else if (visibility === 'Register') {
      if (user != null) return true;
    } else if (visibility === 'Private') {
      if (user != null && this.isMemberOf(user.username, timeline)) {
        return true;
      }
    }
    return false;
  }

  hasPostPermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline
  ): boolean {
    if (user != null && user.administrator) return true;

    return (
      user != null &&
      (timeline.owner.username === user.username ||
        this.isMemberOf(user.username, timeline))
    );
  }

  hasManagePermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline
  ): boolean {
    if (user != null && user.administrator) return true;

    return user != null && user.username == timeline.owner.username;
  }

  hasModifyPostPermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline,
    post: TimelinePostInfo
  ): boolean {
    if (user != null && user.administrator) return true;

    return (
      user != null &&
      (user.username === timeline.owner.username ||
        user.username === post.author.username)
    );
  }
}

export type PersonalTimelineService = TimelineServiceTemplate<
  TimelineInfo,
  PersonalTimelineChangePropertyRequest
>;

export const personalTimelineService: PersonalTimelineService = new TimelineServiceTemplate<
  TimelineInfo,
  PersonalTimelineChangePropertyRequest
>((name) => `${apiBaseUrl}/timelines/@${name}`);

export type OrdinaryTimelineService = TimelineServiceTemplate<
  TimelineInfo,
  OrdinaryTimelineChangePropertyRequest
>;

export const ordinaryTimelineService: OrdinaryTimelineService = new TimelineServiceTemplate<
  TimelineInfo,
  TimelineChangePropertyRequest
>((name) => `${apiBaseUrl}/timelines/${name}`);

const timelineNameReg = XRegExp('^[-_\\p{L}]*$', 'u');

export function validateTimelineName(name: string): boolean {
  return timelineNameReg.test(name);
}
