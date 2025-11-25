import { useCallback, useRef, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

type Direction = 'up' | 'down' | null;

export function useScrollDirection() {
  const [direction, setDirection] = useState<Direction>(null);
  const lastOffset = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - lastOffset.current;
    if (Math.abs(diff) > 5) {
      setDirection(diff > 0 ? 'down' : 'up');
      lastOffset.current = currentOffset;
    }
  }, []);

  return { direction, onScroll };
}