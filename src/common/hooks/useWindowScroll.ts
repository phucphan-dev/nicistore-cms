import { useEffect } from 'react';

const useWindowScroll = (
  callback?: () => void,
) => {
  useEffect(() => {
    const listener = (): void => {
      if (callback) callback();
    };
    listener();
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useWindowScroll;
