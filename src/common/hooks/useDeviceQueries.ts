import { useEffect, useState } from 'react';

const mobileMediaQuery = window.matchMedia('(max-width: 576px)');
const tabletMediaQuery = window.matchMedia('(min-width: 577px and max-width: 991px)');
const desktopMediaQuery = window.matchMedia('(max-width: 1199px)');

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 576 && window.innerWidth < 992);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth <= 1199);

  useEffect(() => {
    const queryMobileChanged = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    const queryTabletChanged = (e: MediaQueryListEvent) => {
      setIsTablet(e.matches);
    };
    const queryDesktopChanged = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    try {
      mobileMediaQuery.addEventListener('change', queryMobileChanged);
      tabletMediaQuery.addEventListener('change', queryTabletChanged);
      desktopMediaQuery.addEventListener('change', queryDesktopChanged);
    } catch (error) {
      mobileMediaQuery.addListener(queryMobileChanged);
      tabletMediaQuery.addListener(queryTabletChanged);
      desktopMediaQuery.addListener(queryDesktopChanged);
    }

    return () => {
      try {
        mobileMediaQuery.removeEventListener('change', queryMobileChanged);
        tabletMediaQuery.removeEventListener('change', queryTabletChanged);
        desktopMediaQuery.addEventListener('change', queryDesktopChanged);
      } catch (error) {
        mobileMediaQuery.removeListener(queryMobileChanged);
        tabletMediaQuery.removeListener(queryTabletChanged);
        desktopMediaQuery.removeListener(queryDesktopChanged);
      }
    };
  }, []);

  return { isTablet, isMobile, isDesktop };
}
