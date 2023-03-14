import { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';

const useGaTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState<ReactGA.Tracker[]>([]);
  const gaId: string[] = [''];

  useEffect(() => {
    if (!gaId) return;
    const tracker: ReactGA.Tracker[] = gaId.map((x, i) => ({
      trackingId: x,
      gaOptions: {
        name: `tracker${i + 1}`,
      },
    }));
    ReactGA.initialize(tracker[0]?.trackingId);
    ReactGA.addTrackers(tracker.slice(1));
    setInitialized(tracker);
  }, [gaId]);

  useEffect(() => {
    if (initialized?.length) {
      const trackers = initialized?.map((e) => e.gaOptions?.name || '') || [];
      ReactGA.pageview(location.pathname + location.search, trackers);
    }
  }, [initialized, location]);
};

export default useGaTracker;
