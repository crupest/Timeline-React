import { useEffect, useState } from 'react';

export type RefCallback = (element: HTMLElement | null) => void;

export function useHeightBinding(
  transformer: (height: number) => number = height => height
): [RefCallback, RefCallback] {
  const [source, setSource] = useState<HTMLElement | null>(null);
  const [destination, setDestination] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (source == null) {
      console.debug('useHeightBinding: No source element.');
      return;
    }
    if (destination == null) {
      console.debug('useHeightBinding: No destination element.');
      return;
    }
    destination.style.height = transformer(source.clientHeight) + 'px';
  }, [source, destination]);

  return [setSource, setDestination];
}
