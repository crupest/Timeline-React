export const kEditItems = ['nickname', 'avatar', 'timelineproperty'] as const;

export type EditItem = typeof kEditItems[number];
