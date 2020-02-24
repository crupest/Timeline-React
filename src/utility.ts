import remove from 'lodash/remove';
import pullAt from 'lodash/pullAt';

export function withoutAt<T>(array: T[], ...index: number[]): T[] {
  const newArray = array.slice();
  pullAt(newArray, index);
  return newArray;
}

export function withoutIf<T>(
  array: T[],
  predict: (element: T) => boolean
): T[] {
  const newArray = array.slice();
  remove(newArray, predict);
  return newArray;
}
