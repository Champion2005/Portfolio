import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export const useAnalytics = () => {
  useEffect(() => {
    // Initialize GA4 with your Measurement ID from .env
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
    }
  }, []);

  const trackEvent = (eventName, parameters = {}) => {
    ReactGA.event(eventName, parameters);
  };

  return { trackEvent };
};
