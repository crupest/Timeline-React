import axios from 'axios';

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
  Private: 'timeline.visibilityTooltip.private'
};

export interface PersonalTimelineInfo {
  description: string;
  owner: User;
  visibility: TimelineVisibility;
  members: User[];
  _links: {
    posts: string;
  };
}

export interface OrdinaryTimelineInfo {
  name: string;
  description: string;
  owner: User;
  visibility: TimelineVisibility;
  members: User[];
  _links: {
    posts: string;
  };
}

export interface TimelineInfo {
  name?: string;
  description: string;
  owner: User;
  visibility: TimelineVisibility;
  members: User[];
  _links: {
    posts: string;
  };
}

export interface TimelinePostInfo {
  id: number;
  content: string;
  time: Date;
  author: User;
}

export interface CreatePostRequest {
  content: string;
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

interface RawTimelinePostInfo {
  id: number;
  content: string;
  time: string;
  author: User;
}

interface RawCreatePostRequest {
  content: string;
  time?: string;
}

function processRawTimelinePostInfo(
  raw: RawTimelinePostInfo
): TimelinePostInfo {
  return {
    ...raw,
    time: new Date(raw.time)
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
      .then(res => res.data);
  }

  fetch(name: string): Promise<TTimeline> {
    return axios
      .get<TTimeline>(`${this.urlResolver(name)}`)
      .then(res => res.data);
  }

  fetchPosts(name: string): Promise<TimelinePostInfo[]> {
    const token = getCurrentUser()?.token;
    return axios
      .get<RawTimelinePostInfo[]>(
        token == null
          ? `${this.urlResolver(name)}/posts`
          : `${this.urlResolver(name)}/posts?token=${token}`
      )
      .then(res => res.data.map(p => processRawTimelinePostInfo(p)));
  }

  createPost(
    name: string,
    request: CreatePostRequest
  ): Promise<TimelinePostInfo> {
    const user = this.checkUser();

    const rawReq: RawCreatePostRequest = { content: request.content };
    if (request.time != null) {
      rawReq.time = request.time.toISOString();
    }
    return axios
      .post<RawTimelinePostInfo>(
        `${this.urlResolver(name)}/posts?token=${user.token}`,
        rawReq
      )
      .then(res => processRawTimelinePostInfo(res.data));
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
    return timeline.members.findIndex(m => m.username == username) >= 0;
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
  PersonalTimelineInfo,
  PersonalTimelineChangePropertyRequest
>;

export const personalTimelineService: PersonalTimelineService = new TimelineServiceTemplate<
  PersonalTimelineInfo,
  PersonalTimelineChangePropertyRequest
>(name => `${apiBaseUrl}/users/${name}/timeline`);

export type OrdinaryTimelineService = TimelineServiceTemplate<
  OrdinaryTimelineInfo,
  OrdinaryTimelineChangePropertyRequest
>;

export const ordinaryTimelineService: OrdinaryTimelineService = new TimelineServiceTemplate<
  OrdinaryTimelineInfo,
  OrdinaryTimelineChangePropertyRequest
>(name => `${apiBaseUrl}/timelines/${name}`);
