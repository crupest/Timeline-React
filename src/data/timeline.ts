import axios, { AxiosResponse } from 'axios';

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

export function fetchTimeline(
  url: string
): Promise<AxiosResponse<BaseTimelineInfo>> {
  return axios.get<BaseTimelineInfo>(url);
}
