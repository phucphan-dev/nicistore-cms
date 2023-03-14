import React, {
  createContext, useEffect, useMemo, useState
} from 'react';

import useDidMount from 'common/hooks/useDidMount';

export interface LayoutContextResponse {
  collapsed: boolean;
  setCollapsed?: () => void;
}

export const LayoutContext = createContext<LayoutContextResponse>({
  collapsed: false,
});

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [collapsed, setIsCollapsed] = useState(false);
  const context: LayoutContextResponse = useMemo(() => ({
    collapsed,
    setCollapsed: () => setIsCollapsed(!collapsed),
  }), [collapsed]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      }

      if (window.innerWidth > 1279 && collapsed) {
        setIsCollapsed(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  useDidMount(() => {
    if (window.innerWidth < 1280) {
      setIsCollapsed(true);
    }

    if (window.innerWidth > 1279 && collapsed) {
      setIsCollapsed(false);
    }
  });

  return (
    <LayoutContext.Provider value={context}>
      {children}
    </LayoutContext.Provider>
  );
};
