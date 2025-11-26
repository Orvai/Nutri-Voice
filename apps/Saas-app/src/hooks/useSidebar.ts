import { useCallback, useState } from 'react';

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return { collapsed, setCollapsed, toggleSidebar };
}