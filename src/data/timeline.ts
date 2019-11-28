import axios, { AxiosResponse } from 'axios';

export type TimelineVisibility = 'Public' | 'Register' | 'Private';

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
