import React, { useEffect, MutableRefObject } from 'react';

const useClickOutside = <T extends HTMLElement | HTMLDivElement>(
  ref: React.RefObject<T>,
  callback: (event: MouseEvent) => void,
): void => {
  const handleClick = (e: MouseEvent): void => {
    if (ref.current && !ref.current.contains((e.target as Node) || null)) {
      callback(e);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleClick);

    return (): void => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref as MutableRefObject<T>, callback]);
};

export default useClickOutside;
