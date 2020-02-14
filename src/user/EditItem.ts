export const kPersonalTimelineManageItems = [
  'nickname',
  'avatar',
  'property'
] as const;

export type PersonalTimelineManageItem = typeof kPersonalTimelineManageItems[number];
