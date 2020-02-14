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

export interface TimelineChangePropertyRequest {
  visibility?: TimelineVisibility;
  description?: string;
}

interface TimelineServiceTemplate<
  TTimeline,
  TChangePropertyRequest,
  TPost = TimelinePostInfo
> {
  changeProperty(
    name: string,
    request: TChangePropertyRequest
  ): Promise<TTimeline>;
  fetch(name: string): Promise<TTimeline>;
  fetchPosts(name: string): Promise<TPost[]>;
  createPost(name: string, post: CreatePostRequest): Promise<TPost>;
  deletePost(name: string, id: number): Promise<void>;
  addMember(name: string, username: string): Promise<void>;
  removeMember(name: string, username: string): Promise<void>;

  isMemberOf(username: string, timeline: TTimeline): boolean;
  hasReadPermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline
  ): boolean;
  hasPostPermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline
  ): boolean;
  hasManagePermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline
  ): boolean;
  hasModifyPostPermission(
    user: UserAuthInfo | null | undefined,
    timeline: TTimeline,
    post: TPost
  ): boolean;
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

export class PersonalTimelineService
  implements
    TimelineServiceTemplate<
      PersonalTimelineInfo,
      TimelineChangePropertyRequest
    > {
  private checkUser(): UserWithToken {
    const user = getCurrentUser();
    if (user == null) {
      throw new Error('You must login to perform the operation.');
    }
    return user;
  }

  changeProperty(
    name: string,
    req: TimelineChangePropertyRequest
  ): Promise<PersonalTimelineInfo> {
    const user = this.checkUser();

    return axios
      .patch<PersonalTimelineInfo>(
        `${apiBaseUrl}/users/${name}/timeline?token=${user.token}`,
        req
      )
      .then(res => res.data);
  }

  fetch(name: string): Promise<PersonalTimelineInfo> {
    return axios
      .get<PersonalTimelineInfo>(`${apiBaseUrl}/users/${name}/timeline`)
      .then(res => res.data);
  }

  fetchPosts(name: string): Promise<TimelinePostInfo[]> {
    const token = getCurrentUser()?.token;
    return axios
      .get<RawTimelinePostInfo[]>(
        token == null
          ? `${apiBaseUrl}/users/${name}/timeline/posts`
          : `${apiBaseUrl}/users/${name}/timeline/posts?token=${token}`
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
        `${apiBaseUrl}/users/${name}/timeline/posts?token=${user.token}`,
        rawReq
      )
      .then(res => processRawTimelinePostInfo(res.data));
  }

  deletePost(name: string, id: number): Promise<void> {
    const user = this.checkUser();

    return axios.delete(
      `${apiBaseUrl}/users/${name}/timeline/posts/${id}?token=${user.token}`
    );
  }

  addMember(name: string, username: string): Promise<void> {
    const user = this.checkUser();

    return axios.put(
      `${apiBaseUrl}/users/${name}/timeline/members/${username}?token=${user.token}`
    );
  }

  removeMember(name: string, username: string): Promise<void> {
    const user = this.checkUser();

    return axios.delete(
      `${apiBaseUrl}/users/${name}/timeline/members/${username}?token=${user.token}`
    );
  }

  isMemberOf(username: string, timeline: PersonalTimelineInfo): boolean {
    return timeline.members.findIndex(m => m.username == username) >= 0;
  }

  hasReadPermission(
    user: UserAuthInfo | null | undefined,
    timeline: PersonalTimelineInfo
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
    timeline: PersonalTimelineInfo
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
    timeline: PersonalTimelineInfo
  ): boolean {
    if (user != null && user.administrator) return true;

    return user != null && user.username == timeline.owner.username;
  }

  hasModifyPostPermission(
    user: UserAuthInfo | null | undefined,
    timeline: PersonalTimelineInfo,
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

export const personalTimelineService = new PersonalTimelineService();
